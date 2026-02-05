import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { PresetsProvider } from '@/context/PresetsContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { TrainingProvider } from '@/context/TrainingContext';
import { WorkoutProvider } from '@/context/WorkoutContext';
import { useColorScheme } from '@/hooks/use-color-scheme';




export const unstable_settings = {
  anchor: '(tabs)',
};
// Come se fosse App Component
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    //App
    //  └── SettingsProvider ✅ Provider qui!
    //       └── Stack
    //            └── (tabs)
    //                 └── settings.tsx
    //                      └── useSettings() ✅ Trova il Provider!
    //Il Provider deve essere un componente GENITORE di tutti i componenti che usano il Context.
    <SettingsProvider>
      <TrainingProvider>
        <WorkoutProvider>
          <PresetsProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </PresetsProvider>
        </WorkoutProvider>
      </TrainingProvider>
    </SettingsProvider>
  );
}
