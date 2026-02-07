/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#e7e6e6';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#e4e4e4',
    tint: tintColorLight,
    icon: '#1f1f1f',
    iconFocus: '#ffffff',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Colori aggiuntivi
    card: '#f8f8f8',
    cardText: '#11181C',
    border: '#E0E0E0',
    buttonPrimary: '#007AFF',
    buttonSecondary: '#4aa2ff',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
     iconFocus: '#ffffff',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Colori aggiuntivi
    card: '#1a1a1a',
    cardText: '#ECEDEE',
    border: '#333333',
    buttonPrimary: '#0A84FF',
    buttonSecondary: '#5ac8fa',
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
