import { StyleSheet } from 'react-native';
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

export const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <ThemedView  lightColor="#f8f8f8" darkColor="#1a1a1a" style={styles.container}>
    <ThemedText >{title}</ThemedText>
    {children}
  </ThemedView>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 20, // Arrotonda gli angoli a pillola
    padding: 20, // Aggiungi padding per spaziare il contenuto dai bordi
    margin: 5,
  },
});