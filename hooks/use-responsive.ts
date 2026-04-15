import { useWindowDimensions } from 'react-native';

/**
 * Breakpoints:
 *   phone   < 600px
 *   tablet  600–1023px
 *   desktop ≥ 1024px
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isPhone = width < 600;
  const isTablet = width >= 600 && width < 1024;
  const isDesktop = width >= 1024;
  const isLargeScreen = !isPhone;

  // Larghezza massima del contenuto su schermi grandi (per centrare)
  const contentMaxWidth = isDesktop ? 900 : isTablet ? 700 : undefined;

  // Colonne per griglie (es. FlatList)
  const numColumns = isDesktop ? 3 : isTablet ? 2 : 1;

  // Padding bottom per la tab bar floating
  const tabBarBottomPadding = isDesktop ? 70 : isTablet ? 80 : 90;

  return {
    width,
    height,
    isPhone,
    isTablet,
    isDesktop,
    isLargeScreen,
    contentMaxWidth,
    numColumns,
    tabBarBottomPadding,
  };
}
