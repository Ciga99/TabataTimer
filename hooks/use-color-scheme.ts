import { useTheme } from '@/context/ThemeContext';

/**
 * Hook che ritorna il tema corrente basato sulla preferenza utente.
 * Se l'utente sceglie 'system', usa le impostazioni di sistema.
 * Altrimenti usa la preferenza salvata.
 */
export function useColorScheme() {
  const { colorScheme } = useTheme();
  return colorScheme;
}
