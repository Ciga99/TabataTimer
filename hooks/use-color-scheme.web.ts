import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

/**
 * Versione web del hook useColorScheme.
 * Gestisce l'hydration per il rendering statico su web.
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { colorScheme } = useTheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
