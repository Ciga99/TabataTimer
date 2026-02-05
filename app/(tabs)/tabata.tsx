import { SettingButtonTrayning } from '@/components/homeComponents/smallbutton';
import { TrainingModal } from '@/components/modaltraynig';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTraining } from '@/context/TrainingContext';
import { Training } from '@/types/Training';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';

const MAX_BUTTON_SIZE = 400;
const MAX_SMALL_BUTTON_SIZE = 60;

export default function TabTwoScreen() {
  const { training, setTraining } = useTraining();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { width, height } = useWindowDimensions();

  // Calcola dimensioni reattive
  const availableHeight = height - 200; // Spazio per header, testo, bottoni piccoli
  const availableWidth = width - 16;
  const buttonSize = Math.min(availableWidth, availableHeight, MAX_BUTTON_SIZE);
  const smallButtonSize = Math.min((width / 6) - 16, MAX_SMALL_BUTTON_SIZE);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const handleSaveTraining = (updatedTraining: Training) => {
    setTraining(updatedTraining);
    closeModal();
  };

  // Stili dinamici per dimensioni reattive
  const dynamicBigButton = {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
  };

  const dynamicSmallButton = {
    width: smallButtonSize,
    height: smallButtonSize,
  };

  const dynamicSmallButtonText = {
    fontSize: smallButtonSize * 0.25,
  };

  return (
    <ThemedView style={styles.container}>
       <ThemedText>Tempo rimanente: 23:00</ThemedText>
      <TouchableOpacity
        style={[styles.bigButton, dynamicBigButton]}
        onPress={() => console.log('Premuto!')}
      >
        <ThemedText>PREMI</ThemedText>
      </TouchableOpacity>

      <ThemedView style={styles.containerButton}>
        <SettingButtonTrayning style={[styles.smallButton, dynamicSmallButton]} title="workTime" onPress={openModal}>
          <ThemedText style={dynamicSmallButtonText}>{training.timeWork}s</ThemedText>
        </SettingButtonTrayning>
        <SettingButtonTrayning style={[styles.smallButton, dynamicSmallButton]} title="restTime" onPress={openModal}>
          <ThemedText style={dynamicSmallButtonText}>{training.timePause}s</ThemedText>
        </SettingButtonTrayning>
        <SettingButtonTrayning style={[styles.smallButton, dynamicSmallButton]} title="series" onPress={openModal}>
          <ThemedText style={dynamicSmallButtonText}>{training.serial}</ThemedText>
        </SettingButtonTrayning>
        <SettingButtonTrayning style={[styles.smallButton, dynamicSmallButton]} title="seriesRest" onPress={openModal}>
          <ThemedText style={dynamicSmallButtonText}>{training.timePauseCycle}s</ThemedText>
        </SettingButtonTrayning>
        <SettingButtonTrayning style={[styles.smallButton, dynamicSmallButton]} title="cycles" onPress={openModal}>
          <ThemedText style={dynamicSmallButtonText}>{training.cycles}</ThemedText>
        </SettingButtonTrayning>
        <SettingButtonTrayning style={[styles.smallButton, dynamicSmallButton]} title="cycleRest" onPress={openModal}>
          <ThemedText style={dynamicSmallButtonText}>{training.timePauseCycle}s</ThemedText>
        </SettingButtonTrayning>
      </ThemedView>

      <TrainingModal
        visible={isModalVisible}
        onClose={closeModal}
        onSave={handleSaveTraining}
        training={training}
        title="Modifica Allenamento"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bigButton: {
    margin: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  smallButton: {
    margin: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});
