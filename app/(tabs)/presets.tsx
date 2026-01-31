import { Card } from '@/components/Card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Speakers } from '@/context/SettingsContext';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

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

type typeTime = 'sec' | 'min' | 'hour';

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
    id: '2',
    title: 'Workout Addominali Sfida',
    description: '4 Settimane',
    numberCycles: 2,
    numberSerial: 4,
    timeWork: 30,
    timePause: 10,
    timePauseCycle: 10,
    voice: 'Alice',
    isVoiceEnabled: true,
  }
];


export default function HomeScreen() {
  const totalTimeWork: number = 20; // Calcolo del tempo totale di lavoro in base ai parametri del preset

    const handleAddPreset = () => {
    console.log('Aggiungi nuovo preset');
    // Navigazione o apertura modale
  };
  
  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={mockPresets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <Card title={item.title}>
          <ThemedText >{item.description} </ThemedText>
          <ThemedText >Numeero cili: {item.numberCycles}  - Numeero cili:{item.numberSerial} </ThemedText>          
          <ThemedText >Tempo totale di lavoro: {totalTimeWork} min </ThemedText>
        </Card>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonAdd: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    bottom: 20,
    right: 20,
  }
});