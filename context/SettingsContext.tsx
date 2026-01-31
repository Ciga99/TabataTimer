import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type Languages = 'ITA' | 'ENG';
export type Speakers = 'Alice' | 'Bob' | 'Charlie';

export const LANGUAGES: Languages[] = ['ITA', 'ENG'];
export const SPEAKERS: Speakers[] = ['Alice', 'Bob', 'Charlie'];

// 1. Definisci il tipo
type SettingsContextType = {
    volume: number;
    setVolume: (volume : number) => void;
    language: Languages;
    setLanguage: (language : Languages) => void;
    voice: Speakers;
    setVoice: (voice : Speakers) => void;
    voiceActive: boolean;
    setVoiceActive: (voiceActive : boolean) => void;
}

// 2. Crea il Context molto simile al servizio in angular  Cosa fa: Crea il "contenitore" vuoto che conterrà i dati.  per ora undefined
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// 3. Provider
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [volume, setVolume] = useState(0.5);
  const [language, setLanguage] = useState<Languages>('ITA');
  const [voice, setVoice] = useState<Speakers>('Alice');
  const [voiceActive, setVoiceActive] = useState(true);

  // Carica le impostazioni salvate all'avvio Caricamento iniziale (useEffect)
  useEffect(() => {
    loadSettings();
  }, []);

  // Salva automaticamente quando i valori cambiano 
  useEffect(() => {
    saveSettings();
  }, [volume, language, voice, voiceActive]);

  // Funzione per caricare le impostazioni
  const loadSettings = async () => {
    try {
      const savedVolume = await AsyncStorage.getItem('volume');
      const savedLanguage = await AsyncStorage.getItem('language');
      const savedVoice = await AsyncStorage.getItem('voice');
      const savedVoiceActive = await AsyncStorage.getItem('voiceActive');

      if (savedVolume !== null) setVolume(parseFloat(savedVolume));
      if (savedLanguage !== null) setLanguage(savedLanguage as Languages);
      if (savedVoice !== null) setVoice(savedVoice as Speakers);
      if (savedVoiceActive !== null) setVoiceActive(savedVoiceActive === 'true');
    } catch (error) {
      console.error('Errore nel caricamento delle impostazioni:', error);
    }
  };

  // Funzione per salvare le impostazioni
  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('volume', volume.toString());
      await AsyncStorage.setItem('language', language);
      await AsyncStorage.setItem('voice', voice);
      await AsyncStorage.setItem('voiceActive', voiceActive.toString());
    } catch (error) {
      console.error('Errore nel salvataggio delle impostazioni:', error);
    }
  };

  return (
    // componente che "fornisce" i dati
    <SettingsContext.Provider  
      value={{
        volume,
        setVolume,
        language,
        setLanguage,
        voice,
        setVoice,
        voiceActive,
        setVoiceActive,
      }}>
      {children}
    </SettingsContext.Provider>
  );
};

// 4. Hook personalizzato per usare il Context facilita l'accesso ai dati del contesto quando lo chiamo non devo controllare se esiste 
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings deve essere usato dentro SettingsProvider');
  }
  return context;
};