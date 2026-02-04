import { Card } from '@/components/Card';
import { TrainingModal } from '@/components/modaltraynig';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { usePresets } from '@/context/PresetsContext';
import { useTraining } from '@/context/TrainingContext';
import { Preset, Training } from '@/types/Training';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PresetsScreen() {
  const { presets, addPreset, updatePreset, deletePreset, getPresetById, isLoaded } = usePresets();
  const { setTraining } = useTraining();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [presetToEdit, setPresetToEdit] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const openModalForEdit = (id: string) => {
    setPresetToEdit(id);
    setIsCreatingNew(false);
    setIsModalVisible(true);
  };

  const openModalForNew = () => {
    setPresetToEdit(null);
    setIsCreatingNew(true);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setPresetToEdit(null);
    setIsCreatingNew(false);
    setIsModalVisible(false);
  };

  // Converte Preset in Training (rimuove l'id)
  const presetToTraining = (preset: Preset): Training => {
    const { id, ...training } = preset;
    return training;
  };

  // Gestisce il salvataggio dal modal
  const handleSaveTraining = (trainingData: Training) => {
    if (isCreatingNew) {
      addPreset(trainingData);
    } else if (presetToEdit) {
      updatePreset(presetToEdit, trainingData);
    }
    closeModal();
  };

  // Quando l'utente seleziona un preset per USARLO
  const handleSelectPreset = (preset: Preset) => {
    const training = presetToTraining(preset);
    setTraining(training);
    Alert.alert(
      'Preset Selezionato',
      `"${preset.title}" è stato impostato come allenamento attivo.`
    );
  };

  // Elimina con conferma
  const handleDeletePreset = (id: string, title: string) => {
    Alert.alert(
      'Elimina Preset',
      `Sei sicuro di voler eliminare "${title}"?`,
      [
        { text: 'Annulla', style: 'cancel' },
        { text: 'Elimina', style: 'destructive', onPress: () => deletePreset(id) },
      ]
    );
  };

  const calculateTotalTime = (preset: Preset): number => {
    const workTime = preset.timeWork * preset.serial * preset.cycles;
    const pauseTime = preset.timePause * (preset.serial - 1) * preset.cycles;
    const cyclePauseTime = preset.timePauseCycle * (preset.cycles - 1);
    return Math.round((workTime + pauseTime + cyclePauseTime) / 60);
  };

  // Ottieni i dati iniziali per il modal
  const getModalTraining = (): Training | undefined => {
    if (isCreatingNew) {
      return undefined;
    }
    if (presetToEdit) {
      const preset = getPresetById(presetToEdit);
      return preset ? presetToTraining(preset) : undefined;
    }
    return undefined;
  };

  if (!isLoaded) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.loadingText}>Caricamento...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={presets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectPreset(item)}>
            <Card title={item.title}>
              <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                  <ThemedText style={styles.description}>{item.description}</ThemedText>
                  <ThemedText style={styles.details}>
                    Cicli: {item.cycles} - Serie: {item.serial} - tempo serie: {item.timeWork}s
                  </ThemedText>
                  <ThemedText style={styles.details}>
                    Tempo totale: {calculateTotalTime(item)} min
                  </ThemedText>
                </View>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => openModalForEdit(item.id)}>
                  <IconSymbol name="pencil" size={22} color="#565656" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleDeletePreset(item.id, item.title)}>
                  <IconSymbol name="trash" size={22} color="#ff3b30" />
                </TouchableOpacity>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fabButton}
        onPress={openModalForNew}>
        <IconSymbol name="plus" size={24} color="white" />
      </TouchableOpacity>

      <TrainingModal
        visible={isModalVisible}
        onClose={closeModal}
        onSave={handleSaveTraining}
        training={getModalTraining()}
        title={isCreatingNew ? 'Nuovo Preset' : 'Modifica Preset'}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
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
  iconButton: {
    padding: 8,
  },
  fabButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    bottom: 120,
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
