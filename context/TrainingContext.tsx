import { Training } from "@/types/Training";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type TrainingContextType = {
  training: Training;
  setTraining: (training: Training) => void;
};

export const TrainingContext = createContext<TrainingContextType | undefined>(
  undefined,
);

export const TrainingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [training, setTraining] = useState<Training>({
    title: "",
    description: "",
    cycles: 1,
    serial: 8,
    timeWork: 30,
    timePause: 30,
    timePauseCycle: 30,
    timeTotal: 0,
    voice: "Donna",
    isVoiceEnabled: true,
  });

  const [isLoaded, setIsLoaded] = useState(false); // Flag per evitare salvataggi durante il caricamento

  // Carica le impostazioni salvate all'avvio Caricamento iniziale (useEffect)
  useEffect(() => {
    loadSettings();
  }, []);

  // Salva automaticamente quando i valori cambiano
  useEffect(() => {
    if (isLoaded) {
      saveSettings();
    }
  }, [training, isLoaded]);

  // Funzione per caricare le impostazioni
  const loadSettings = async () => {
    try {
      const savedTraining = await AsyncStorage.getItem("training");
      if (savedTraining !== null) {
        const parsed = JSON.parse(savedTraining);
        // Migrazione: vecchi nomi speaker -> nuovi
        if (parsed.voice !== "Donna" && parsed.voice !== "Uomo" && parsed.voice !== "Random")
          parsed.voice = "Donna"; // vecchi nomi o valori sconosciuti -> Donna
        setTraining(parsed);
      }
    } catch (error) {
      console.error("Errore nel caricamento delle impostazioni:", error);
    } finally {
      setIsLoaded(true); // Indica che il caricamento è completo
    }
  };

  // Funzione per salvare le impostazioni
  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem("training", JSON.stringify(training));
    } catch (error) {
      console.error("Errore nel salvataggio delle impostazioni:", error);
    }
  };

  return (
    // componente che "fornisce" i dati
    <TrainingContext.Provider
      value={{
        training,
        setTraining,
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};

// 4. Hook personalizzato per usare il Context facilita l'accesso ai dati del contesto quando lo chiamo non devo controllare se esiste
export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error("useTraining deve essere usato dentro TrainingProvider");
  }
  return context;
};
