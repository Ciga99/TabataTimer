import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

export const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <ThemedView
      lightColor={Colors.light.card}
      darkColor={Colors.dark.card}
      style={styles.container}
    >
      <ThemedText style={styles.title}>{title}</ThemedText>
      {children}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20, // Arrotonda gli angoli a pillola
    padding: 20, // Aggiungi padding per spaziare il contenuto dai bordi
    margin: 5,
  },
  title: { 
    margin: 5,
  }
});