import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { PresetsProvider } from '@/context/PresetsContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { TrainingProvider } from '@/context/TrainingContext';
import { WorkoutProvider } from '@/context/WorkoutContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Componente interno che usa il tema
function AppContent() {
  const { colorScheme } = useTheme();

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

// Root Layout - ThemeProvider deve essere il primo!
export default function RootLayout() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <TrainingProvider>
          <WorkoutProvider>
            <PresetsProvider>
              <AppContent />
            </PresetsProvider>
          </WorkoutProvider>
        </TrainingProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
