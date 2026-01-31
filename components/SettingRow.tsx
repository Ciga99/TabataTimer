import { StyleSheet, View } from 'react-native';
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

export const SettingRow: React.FC<{ label: string; slider?: boolean; children?: React.ReactNode }> = ({ label, slider, children }) => (
  <ThemedView lightColor="transparent" darkColor="transparent" style={ slider?styles.contentside : styles.container}>
    <ThemedText style={ slider? styles.labelSlider : ''}>{label}</ThemedText>
    {slider ? (<View style={styles.sliderWrapper}>{children}</View>) : (children)}
  </ThemedView>
);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentside: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  labelSlider: {
    marginRight: 10,
  },
  sliderWrapper: {
    flex: 1,
  }
});