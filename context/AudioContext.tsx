import { AUDIO_MAP, AudioEvent, AudioSpeaker, COUNTDOWN_SOUND } from '@/constants/audioAssets';
import { Audio } from 'expo-av';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef } from 'react';
import { useSettings } from './SettingsContext';
import { useTraining } from './TrainingContext';
import { useWorkout, WorkoutPhase, WorkoutState } from './WorkoutContext';

type AudioContextType = {
  playUserAction: (action: 'start' | 'pause' | 'resume' | 'reset') => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { volume, language, voice, voiceActive } = useSettings();
  const { training } = useTraining();
  const { workoutState } = useWorkout();

  const prevStateRef = useRef<WorkoutState>(workoutState);
  const soundRef = useRef<Audio.Sound | null>(null);
  // Audio silenzioso in loop: mantiene la sessione audio iOS attiva in background
  const keepaliveRef = useRef<Audio.Sound | null>(null);

  // Configura audio mode all'avvio — staysActiveInBackground: true per iOS background
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
  }, []);

  // Helper: risolvi lo speaker effettivo
  const getEffectiveSpeaker = useCallback((): AudioSpeaker => {
    const activeSpeaker = training.isVoiceEnabled ? training.voice : voice;
    if (activeSpeaker === 'Random') {
      return Math.random() < 0.5 ? 'Donna' : 'Uomo';
    }
    return activeSpeaker as AudioSpeaker;
  }, [training.voice, training.isVoiceEnabled, voice]);

  // Helper: controlla se la voce e' abilitata (globale E per-training)
  const isVoiceEnabled = useCallback((): boolean => {
    return voiceActive && training.isVoiceEnabled;
  }, [voiceActive, training.isVoiceEnabled]);

  // Funzione core per riprodurre un suono
  const playSound = useCallback(async (source: any) => {
    try {
      // Scarica il suono precedente se ancora caricato
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(source, { volume });
      soundRef.current = sound;

      // Auto-unload al termine della riproduzione
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          if (soundRef.current === sound) {
            soundRef.current = null;
          }
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.error('Errore riproduzione audio:', error);
    }
  }, [volume]);

  // Avvia audio silenzioso in loop per mantenere la sessione audio iOS attiva
  const startKeepalive = useCallback(async () => {
    if (keepaliveRef.current) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/silence.wav'),
        { isLooping: true, volume: 0, isMuted: true }
      );
      keepaliveRef.current = sound;
      await sound.playAsync();
    } catch (e) {
      console.warn('Keepalive audio non avviato:', e);
    }
  }, []);

  // Ferma audio silenzioso
  const stopKeepalive = useCallback(async () => {
    if (!keepaliveRef.current) return;
    try {
      await keepaliveRef.current.stopAsync();
      await keepaliveRef.current.unloadAsync();
      keepaliveRef.current = null;
    } catch (e) {
      console.warn('Keepalive audio non fermato:', e);
    }
  }, []);

  // Effect unico: osserva workoutState per countdown, transizioni di fase e keepalive
  useEffect(() => {
    const prev = prevStateRef.current;
    const curr = workoutState;

    // Aggiorna il ref per il prossimo render
    prevStateRef.current = curr;

    // --- KEEPALIVE: avvia/ferma audio silenzioso ---
    if (curr.isWorking && !prev.isWorking) {
      startKeepalive();
    }
    if (!curr.isWorking && prev.isWorking) {
      stopKeepalive();
    }

    // --- COUNTDOWN: 3 secondi rimanenti --- (sempre, anche con voce disabilitata)
    if (
      curr.isWorking &&
      !curr.isPaused &&
      curr.phaseTimeRemaining === 3 &&
      prev.phaseTimeRemaining === 4
    ) {
      playSound(COUNTDOWN_SOUND);
      return; // Non sovrapporre countdown e transizione
    }

    if (!isVoiceEnabled()) return;

    // --- TRANSIZIONE DI FASE ---
    if (prev.phase !== curr.phase && curr.isWorking) {
      // Ignora la transizione idle -> work (gestita da playUserAction('start'))
      if (prev.phase === 'idle') return;

      const speaker = getEffectiveSpeaker();

      if (curr.phase === 'finished') {
        playSound(AUDIO_MAP[language]['end'][speaker]);
      } else if (curr.phase === 'work' || curr.phase === 'rest' || curr.phase === 'cycle_rest') {
        playSound(AUDIO_MAP[language][curr.phase as AudioEvent][speaker]);
      }
    }
  }, [workoutState, isVoiceEnabled, playSound, getEffectiveSpeaker, language, startKeepalive, stopKeepalive]);

  // Metodo per azioni utente (start, pause, resume, reset)
  const playUserAction = useCallback((action: 'start' | 'pause' | 'resume' | 'reset') => {
    if (!isVoiceEnabled()) return;
    const speaker = getEffectiveSpeaker();
    playSound(AUDIO_MAP[language][action as AudioEvent][speaker]);
  }, [language, isVoiceEnabled, getEffectiveSpeaker, playSound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
      keepaliveRef.current?.unloadAsync();
    };
  }, []);

  return (
    <AudioContext.Provider value={{ playUserAction }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio deve essere usato dentro AudioProvider');
  }
  return context;
};
