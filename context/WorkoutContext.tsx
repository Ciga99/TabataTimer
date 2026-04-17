import { dismissWorkoutNotification, showWorkoutNotification } from '@/services/NotificationService';
import { Training } from '@/types/Training';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

// Tipi per le fasi del workout
export type WorkoutPhase = 'idle' | 'work' | 'rest' | 'cycle_rest' | 'finished';

// Tipo per lo stato del workout
export type WorkoutState = {
  isWorking: boolean;           // Timer attivo (per la tab bar)
  isPaused: boolean;            // Timer in pausa
  phase: WorkoutPhase;          // Fase corrente
  currentCycle: number;         // Ciclo corrente (1-based)
  currentSerial: number;        // Serie corrente (1-based)
  phaseTimeRemaining: number;   // Secondi rimanenti nella fase corrente
  totalTimeRemaining: number;   // Secondi totali rimanenti
};

type WorkoutContextType = {
  workoutState: WorkoutState;
  startWorkout: (training: Training) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  stopWorkout: () => void;
};

const initialState: WorkoutState = {
  isWorking: false,
  isPaused: false,
  phase: 'idle',
  currentCycle: 0,
  currentSerial: 0,
  phaseTimeRemaining: 0,
  totalTimeRemaining: 0,
};

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Helper: Calcola il tempo totale
const calculateTotalTime = (training: Training): number => {
  return (
    (training.timeWork * training.serial * training.cycles) +
    (training.timePause * (training.serial - 1) * training.cycles) +
    (training.timePauseCycle * (training.cycles - 1))
  );
};

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workoutState, setWorkoutState] = useState<WorkoutState>(initialState);
  const intervalRef = useRef<number | null>(null);
  const trainingRef = useRef<Training | null>(null);

  // Refs per il timer basato su timestamp (preciso anche in background)
  const phaseEndTimeRef = useRef<number>(0);
  const workoutStartTimeRef = useRef<number>(0);
  const totalTimeAtStartRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  // Helper: Determina la prossima fase
  const getNextPhase = useCallback((
    currentPhase: WorkoutPhase,
    currentSerial: number,
    currentCycle: number,
    training: Training
  ): { phase: WorkoutPhase; serial: number; cycle: number; duration: number } => {
    if (currentPhase === 'work') {
      if (currentSerial < training.serial) {
        return { phase: 'rest', serial: currentSerial, cycle: currentCycle, duration: training.timePause };
      } else if (currentCycle < training.cycles) {
        return { phase: 'cycle_rest', serial: currentSerial, cycle: currentCycle, duration: training.timePauseCycle };
      } else {
        return { phase: 'finished', serial: currentSerial, cycle: currentCycle, duration: 0 };
      }
    }

    if (currentPhase === 'rest') {
      return { phase: 'work', serial: currentSerial + 1, cycle: currentCycle, duration: training.timeWork };
    }

    if (currentPhase === 'cycle_rest') {
      return { phase: 'work', serial: 1, cycle: currentCycle + 1, duration: training.timeWork };
    }

    return { phase: 'finished', serial: currentSerial, cycle: currentCycle, duration: 0 };
  }, []);

  // FUNZIONE PRINCIPALE: Tick del timer — usa Date.now() per precisione in background
  const tick = useCallback(() => {
    setWorkoutState(prev => {
      if (prev.isPaused || !prev.isWorking) return prev;

      const now = Date.now();
      const newPhaseTime = Math.max(0, Math.round((phaseEndTimeRef.current - now) / 1000));
      const newTotalTime = Math.max(0, Math.round(
        (workoutStartTimeRef.current + totalTimeAtStartRef.current * 1000 - now) / 1000
      ));

      // Fase corrente non terminata
      if (newPhaseTime > 0) {
        return { ...prev, phaseTimeRemaining: newPhaseTime, totalTimeRemaining: newTotalTime };
      }

      // Fase terminata: calcola prossima fase
      const training = trainingRef.current;
      if (!training) return initialState;

      const next = getNextPhase(prev.phase, prev.currentSerial, prev.currentCycle, training);

      if (next.phase === 'finished') {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        dismissWorkoutNotification();
        return {
          ...initialState,
          phase: 'finished',
          currentCycle: prev.currentCycle,
          currentSerial: prev.currentSerial,
        };
      }

      // Aggiorna il timestamp di fine fase (corregge l'overshoot)
      const overshoot = Math.max(0, now - phaseEndTimeRef.current);
      phaseEndTimeRef.current = now + next.duration * 1000 - overshoot;

      return {
        ...prev,
        phase: next.phase,
        currentSerial: next.serial,
        currentCycle: next.cycle,
        phaseTimeRemaining: next.duration,
        totalTimeRemaining: newTotalTime,
      };
    });
  }, [getNextPhase]);

  // START
  const startWorkout = useCallback((training: Training) => {
    trainingRef.current = training;
    const totalTime = calculateTotalTime(training);

    const now = Date.now();
    phaseEndTimeRef.current = now + training.timeWork * 1000;
    workoutStartTimeRef.current = now;
    totalTimeAtStartRef.current = totalTime;

    setWorkoutState({
      isWorking: true,
      isPaused: false,
      phase: 'work',
      currentCycle: 1,
      currentSerial: 1,
      phaseTimeRemaining: training.timeWork,
      totalTimeRemaining: totalTime,
    });

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  // PAUSE
  const pauseWorkout = useCallback(() => {
    pausedAtRef.current = Date.now();
    setWorkoutState(prev => ({ ...prev, isPaused: true }));
  }, []);

  // RESUME
  const resumeWorkout = useCallback(() => {
    const pausedDuration = Date.now() - pausedAtRef.current;
    // Sposta i timestamp in avanti della durata della pausa
    phaseEndTimeRef.current += pausedDuration;
    workoutStartTimeRef.current += pausedDuration;
    setWorkoutState(prev => ({ ...prev, isPaused: false }));
  }, []);

  // STOP
  const stopWorkout = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    trainingRef.current = null;
    dismissWorkoutNotification();
    setWorkoutState(initialState);
  }, []);

  // Aggiorna la notifica Android ad ogni tick (foreground service)
  useEffect(() => {
    if (!workoutState.isWorking || workoutState.isPaused) return;
    if (workoutState.phase === 'finished') {
      dismissWorkoutNotification();
      return;
    }
    showWorkoutNotification(workoutState.phase, workoutState.phaseTimeRemaining);
  }, [workoutState]);

  // Cleanup quando componente smonta
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <WorkoutContext.Provider value={{ workoutState, startWorkout, pauseWorkout, resumeWorkout, stopWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout deve essere usato dentro WorkoutProvider');
  }
  return context;
};
