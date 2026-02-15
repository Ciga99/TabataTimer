/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Sfondi
    background: '#F7F9F9',
    card: '#FFFFFF',
    // Testo
    text: '#0E1B20',
    textSecondary: '#546E7A',
    textOnPrimary: '#FFFFFF',
    // Accenti
    primary: '#00A896',
    secondary: '#E0F2F1',
    // Tab bar
    tint: '#00A896',
    icon: '#546E7A',
    iconFocus: '#FFFFFF',
    tabIconDefault: '#546E7A',
    tabIconSelected: '#00A896',
    // UI
    cardText: '#0E1B20',
    border: '#E0F2F1',
    buttonPrimary: '#00A896',
    buttonSecondary: '#E0F2F1',
    // Input
    inputBackground: '#F7F9F9',
    inputBorder: '#E0F2F1',
    placeholder: '#546E7A',
    // Distruttivo
    destructive: '#ff3b30',
    // Modal
    modalBackground: '#FFFFFF',
  },
  dark: {
    // Sfondi
    background: '#192229',
    card: '#212B36',
    // Testo
    text: '#E6EBEF',
    textSecondary: '#9BAFB8',
    textOnPrimary: '#192229',
    // Accenti
    primary: '#2EE6CA',
    secondary: '#2A3F44',
    // Tab bar
    tint: '#2EE6CA',
    icon: '#9BAFB8',
    iconFocus: '#FFFFFF',
    tabIconDefault: '#9BAFB8',
    tabIconSelected: '#2EE6CA',
    // UI
    cardText: '#E6EBEF',
    border: '#2A3F44',
    buttonPrimary: '#2EE6CA',
    buttonSecondary: '#2A3F44',
    // Input
    inputBackground: '#2A3F44',
    inputBorder: '#3A5058',
    placeholder: '#9BAFB8',
    // Distruttivo
    destructive: '#ff453a',
    // Modal
    modalBackground: '#212B36',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
