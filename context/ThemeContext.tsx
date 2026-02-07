import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

// Tipi
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';

type ThemeContextType = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  colorScheme: ColorScheme;
  isDarkMode: boolean;
};

// Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Chiave per AsyncStorage
const THEME_STORAGE_KEY = 'theme_mode';

// Provider
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Calcola il tema effettivo
  const colorScheme: ColorScheme =
    themeMode === 'system' ? (systemColorScheme ?? 'light') : themeMode;
  const isDarkMode = colorScheme === 'dark';

  // Carica la preferenza salvata all'avvio
  useEffect(() => {
    loadTheme();
  }, []);

  // Salva automaticamente quando il themeMode cambia
  useEffect(() => {
    if (isLoaded) {
      saveTheme();
    }
  }, [themeMode, isLoaded]);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        setThemeModeState(saved as ThemeMode);
      }
    } catch (error) {
      console.error('Errore nel caricamento del tema:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveTheme = async () => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } catch (error) {
      console.error('Errore nel salvataggio del tema:', error);
    }
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        colorScheme,
        isDarkMode,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizzato
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve essere usato dentro ThemeProvider');
  }
  return context;
};
