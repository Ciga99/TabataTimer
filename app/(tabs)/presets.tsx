import { Card } from '@/components/Card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Speakers } from '@/context/SettingsContext';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

export interface Preset {
  id: string;
  title: string;
  description: string;
  numberCycles: number;
  numberSerial: number;
  timeWork: number;
  timePause: number;
  timePauseCycle: number;
  voice: Speakers;
  isVoiceEnabled: boolean;
}

const mockPresets: Preset[] = [
  {
    id: '0',
    title: 'Workout Addominali Sfida',
    description: '4 Settimane',
    numberCycles: 2,
    numberSerial: 4,
    timeWork: 30,
    timePause: 10,
    timePauseCycle: 10,
    voice: 'Alice',
    isVoiceEnabled: true,
  },
  {
    id: '1',
    title: 'Workout Addominali 2',
    description: '8 Settimane',
    numberCycles: 3,
    numberSerial: 5,
    timeWork: 45,
    timePause: 15,
    timePauseCycle: 20,
    voice: 'Alice',
    isVoiceEnabled: true,
  },
  {
    id: '2',
    title: 'Workout Addominali 3',
    description: '12 Settimane',
    numberCycles: 4,
    numberSerial: 6,
    timeWork: 60,
    timePause: 20,
    timePauseCycle: 30,
    voice: 'Alice',
    isVoiceEnabled: true,
  },
  {
    id: '3',
    title: 'Workout Addominali 4',
    description: '16 Settimane',
    numberCycles: 5,
    numberSerial: 6,
    timeWork: 60,
    timePause: 20,
    timePauseCycle: 30,
    voice: 'Alice',
    isVoiceEnabled: true,
  },
  {
    id: '1',
    title: 'Workout Addominali 2',
    description: '8 Settimane',
    numberCycles: 3,
    numberSerial: 5,
    timeWork: 45,
    timePause: 15,
    timePauseCycle: 20,
    voice: 'Alice',
    isVoiceEnabled: true,
  },
  {
    id: '2',
    title: 'Workout Addominali 3',
    description: '12 Settimane',
    numberCycles: 4,
    numberSerial: 6,
    timeWork: 60,
    timePause: 20,
    timePauseCycle: 30,
    voice: 'Alice',
    isVoiceEnabled: true,
  },
  {
    id: '3',
    title: 'Workout Addominali 4',
    description: '16 Settimane',
    numberCycles: 5,
    numberSerial: 6,
    timeWork: 60,
    timePause: 20,
    timePauseCycle: 30,
    voice: 'Alice',
    isVoiceEnabled: true,
  }
];

export default function HomeScreen() {
  const handlePlayPreset = (preset: Preset) => {
    console.log('Play preset:', preset.title);
    // Naviga alla schermata del timer o avvia il workout
  };

  const handleAddPreset = () => {
    console.log('Aggiungi nuovo preset');
    // Navigazione o apertura modale
  };

  const calculateTotalTime = (preset: Preset): number => {
    // Esempio di calcolo (personalizza in base alla tua logica)
    const workTime = preset.timeWork * preset.numberSerial * preset.numberCycles;
    const pauseTime = preset.timePause * (preset.numberSerial - 1) * preset.numberCycles;
    const cyclePauseTime = preset.timePauseCycle * (preset.numberCycles - 1);
    return Math.round((workTime + pauseTime + cyclePauseTime) / 60); // Converti in minuti
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={mockPresets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card title={item.title}>
            <View style={styles.cardContent}>
              {/* Informazioni del preset */}
              <View style={styles.infoContainer}>
                <ThemedText style={styles.description}>{item.description}</ThemedText>
                <ThemedText style={styles.details}>
                  Cicli: {item.numberCycles} - Serie: {item.numberSerial} -tempo serie: {item.timeWork}s - Voce: {item.voice} - abilitata: {item.isVoiceEnabled ? 'Sì' : 'No'}
                </ThemedText>
                <ThemedText style={styles.details}>
                  Tempo totale: {calculateTotalTime(item)} min
                </ThemedText>
              </View>

              {/* Pulsante Play */}
              <TouchableOpacity 
                style={styles.playButton}
                onPress={() => handlePlayPreset(item)}> 
                <IconSymbol name="pencil" size={25} color="#565656" />
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />

      {/* Pulsante Floating per aggiungere preset */}
      <TouchableOpacity 
        style={styles.fabButton}
        onPress={handleAddPreset}>
        <IconSymbol name="plus" size={24} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // ✅ Spazio per il pulsante floating
  },
  cardContent: {
    flexDirection: 'row', // ✅ Riga: info a sinistra, pulsante a destra
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1, // ✅ Prende tutto lo spazio disponibile
    paddingRight: 12,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  details: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  playButton: {
    padding: 8, // ✅ Area di tocco più grande
  },
  fabButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    bottom: 120, // ✅ Sopra la tab bar
    right: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});