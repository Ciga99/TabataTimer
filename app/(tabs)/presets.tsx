import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedView } from '@/components/themed-view';

import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';


export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Tuo contenuto */}
      
      {/* Pulsante floating */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => console.log('Add preset')}>
        <IconSymbol name="plus" size={24} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 120, // Sopra la tab bar (70 + 30 + margine)
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});