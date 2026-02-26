import { Preset } from "@/types/Training";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

const PRESETS_STORAGE_KEY = "presets";

// Preset di default (mostrati al primo avvio)
const defaultPresets: Preset[] = [
  {
    id: "default_1",
    title: "Workout Addominali Sfida",
    description: "4 Settimane",
    cycles: 2,
    serial: 4,
    timeWork: 30,
    timePause: 10,
    timePauseCycle: 10,
    timeTotal: 0,
    voice: "Donna",
    isVoiceEnabled: true,
  },
];

type PresetsContextType = {
  presets: Preset[];
  addPreset: (preset: Omit<Preset, "id">) => void;
  updatePreset: (id: string, preset: Partial<Omit<Preset, "id">>) => void;
  deletePreset: (id: string) => void;
  getPresetById: (id: string) => Preset | undefined;
  isLoaded: boolean;
};

export const PresetsContext = createContext<PresetsContextType | undefined>(
  undefined,
);

// Generatore di ID unici
const generateId = (): string =>
  `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const PresetsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carica i preset al mount
  useEffect(() => {
    loadPresets();
  }, []);

  // Auto-save quando i preset cambiano (dopo il caricamento iniziale)
  useEffect(() => {
    if (isLoaded) {
      savePresets();
    }
  }, [presets, isLoaded]);

  const loadPresets = async () => {
    try {
      const savedPresets = await AsyncStorage.getItem(PRESETS_STORAGE_KEY);
      if (savedPresets !== null) {
        const parsed = JSON.parse(savedPresets);
        // Migrazione: vecchi nomi speaker -> nuovi
        const migrated = parsed.map((p: any) => {
          if (p.voice === "Donna" || p.voice === "Eva")
            return { ...p, voice: "Donna" };
          if (p.voice === "Uomo" || p.voice === "Donna")
            return { ...p, voice: "Uomo" };
          return p;
        });
        setPresets(migrated);
      } else {
        // Prima volta: usa i preset di default
        setPresets(defaultPresets);
      }
    } catch (error) {
      console.error("Errore nel caricamento dei presets:", error);
      setPresets(defaultPresets);
    } finally {
      setIsLoaded(true);
    }
  };

  const savePresets = async () => {
    try {
      await AsyncStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
    } catch (error) {
      console.error("Errore nel salvataggio dei presets:", error);
    }
  };

  const addPreset = (presetData: Omit<Preset, "id">) => {
    const newPreset: Preset = {
      ...presetData,
      id: generateId(),
    };
    setPresets((prev) => [...prev, newPreset]);
  };

  const updatePreset = (id: string, updates: Partial<Omit<Preset, "id">>) => {
    setPresets((prev) =>
      prev.map((preset) =>
        preset.id === id ? { ...preset, ...updates } : preset,
      ),
    );
  };

  const deletePreset = (id: string) => {
    setPresets((prev) => prev.filter((preset) => preset.id !== id));
  };

  const getPresetById = (id: string): Preset | undefined => {
    return presets.find((preset) => preset.id === id);
  };

  return (
    <PresetsContext.Provider
      value={{
        presets,
        addPreset,
        updatePreset,
        deletePreset,
        getPresetById,
        isLoaded,
      }}
    >
      {children}
    </PresetsContext.Provider>
  );
};

export const usePresets = () => {
  const context = useContext(PresetsContext);
  if (!context) {
    throw new Error("usePresets deve essere usato dentro PresetsProvider");
  }
  return context;
};
