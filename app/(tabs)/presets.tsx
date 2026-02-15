import { Card } from '@/components/Card';
import { TrainingModal } from '@/components/modaltraynig';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { usePresets } from '@/context/PresetsContext';
import { useTraining } from '@/context/TrainingContext';
import { Preset, Training } from '@/types/Training';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Animated, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

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
    router.navigate('/tabata');
  };

  // Elimina con conferma
  const handleDeletePreset = (id: string, title: string) => {
    deletePreset(id);
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

  // Render azione sinistra per swipe (cestino)
  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,// quanto hai fatto swipe (0 → 1)
    _dragX: Animated.AnimatedInterpolation<number>,// posizione X del dito 
    item: Preset
  ) => {
    // Animazione: il cestino parte piccolo (0.8) e diventa grande (1) mentre fai swipe
    const scale = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => handleDeletePreset(item.id, item.title)}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <IconSymbol name="trash" size={28} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Gestisce lo swipe completo
  const handleSwipeOpen = (direction: 'left' | 'right', item: Preset, swipeableRef: Swipeable | null) => {
    if (direction === 'left') {
      swipeableRef?.close();
      deletePreset(item.id);
    }
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
        renderItem={({ item }) => {
          let swipeableRef: Swipeable | null = null;// Creo un riferimento per poter chiudere lo swipe programmaticamente
          return (
            <Swipeable
              ref={(ref) => { swipeableRef = ref; }}
              renderLeftActions={(progress, dragX) => renderLeftActions(progress, dragX, item)}
              onSwipeableOpen={(direction) => handleSwipeOpen(direction, item, swipeableRef)}
              leftThreshold={80}// Quanto devi fare swipe per "completare" (80 pixel)
            >
              <TouchableOpacity onPress={() => handleSelectPreset(item)}>
                <Card title={item.title}>
                  <View style={styles.cardContent}>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => openModalForEdit(item.id)}>
                      <IconSymbol name="pencil" size={22} color="#565656" />
                    </TouchableOpacity>
                    <View style={styles.infoContainer}>
                      <ThemedText style={styles.description}>{item.description}</ThemedText>
                      <ThemedText style={styles.details}>
                        Cicli: {item.cycles} - Serie: {item.serial} - tempo serie: {item.timeWork}s
                      </ThemedText>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            </Swipeable>
          );
        }}
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
    padding: 20,
    paddingBottom: 130, // Spazio extra per tab bar e FAB button
  },
  deleteAction: {
    backgroundColor: '#ff453a',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: 5,
    borderRadius: 20,
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
    marginRight: 8,
  },
  fabButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    bottom: 120,
    right: 20,
    backgroundColor: '#00A896',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
