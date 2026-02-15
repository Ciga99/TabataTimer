// components/tab-icon.tsx
import { IconSymbol, } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { StyleSheet, View } from 'react-native';

type TabIconProps = {
  name: React.ComponentProps<typeof IconSymbol>['name'];
  color: string;
  focused: boolean; 
};


export function TabIcon({ name, color, focused }: TabIconProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  return (
    <View style={[focused ? [styles.indicator, { backgroundColor: colors.primary }] : styles.focusedContainer]}>
      <IconSymbol size={28} name={name} color={focused ? colors.iconFocus : colors.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  dark: {
    color: 'white',
  },
  light: {
    color: 'black',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4, // Spazio tra icona e indicatore
  },
  indicator: {
    alignItems: 'center',
    justifyContent: 'center',
    // gap: 4, // Spazio tra icona e indicatore
    width: 35,       // Larghezza cerchio
    height: 35,      // Altezza cerchio
    borderRadius: 50, // Metà di width/height per farlo rotondo
    // backgroundColor viene applicato inline dal componente
  },
  focusedContainer: {
    width: 50,       // Larghezza cerchio
    height: 50,      // Altezza cerchio
    borderRadius: 25, // Metà di width/height per farlo rotondo
    justifyContent: 'center',
    alignItems: 'center',
  },
});