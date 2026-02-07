import { SettingButtonTrayning } from '@/components/homeComponents/smallbutton';
import { TrainingModal } from '@/components/modaltraynig';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTraining } from '@/context/TrainingContext';
import { useWorkout, WorkoutPhase } from '@/context/WorkoutContext';
import { Training } from '@/types/Training';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { formatTime } from '../helper';

const MAX_BUTTON_SIZE = 500;
const MAX_SMALL_BUTTON_SIZE = 150;

// Helper per il testo della fase
const getPhaseLabel = (phase: WorkoutPhase, isPaused: boolean): string => {
  if (isPaused) return 'PAUSA';
  switch (phase) {
    case 'work': return 'LAVORO';
    case 'rest': return 'RIPOSO';
    case 'cycle_rest': return 'PAUSA CICLO';
    case 'finished': return 'FINITO!';
    default: return 'PREMI';
  }
};

// Helper per il colore della fase
const getPhaseColor = (phase: WorkoutPhase, isPaused: boolean): string => {
  if (isPaused) return '#9E9E9E';  // Grigio quando in pausa
  switch (phase) {
    case 'work': return '#4CAF50';      // Verde
    case 'rest': return '#FF9800';       // Arancione
    case 'cycle_rest': return '#f0f321'; // Blu
    case 'finished': return '#3027b0';   // Viola
    default: return '#007AFF';           // Blu default
  }
};

export default function TabTwoScreen() {
  const { training, setTraining } = useTraining();
  const { workoutState, startWorkout, pauseWorkout, resumeWorkout } = useWorkout();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { width, height } = useWindowDimensions();
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Calcola dimensioni reattive
  const TAB_BAR_HEIGHT = 100; // 70px altezza + 30px margine
  const HEADER_HEIGHT = 60; // Altezza approssimativa dell'header
  const availableHeight = height - TAB_BAR_HEIGHT - HEADER_HEIGHT - 40; // lascia spazio per header, footer e margini
  const availableWidth = width - 16;
  const buttonSize = Math.min(availableWidth, availableHeight, MAX_BUTTON_SIZE);
  const smallButtonSize = Math.min((width / 3) - 16, MAX_SMALL_BUTTON_SIZE);

  const openModal = () => {
    // Non aprire modal durante workout
    if (!workoutState.isWorking) {
      setIsModalVisible(true);
    }
  };
  const closeModal = () => setIsModalVisible(false);

  const handleSaveTraining = (updatedTraining: Training) => {
    setTraining(updatedTraining);
    closeModal();
  };

  // Handler per il bottone grande
  const handleBigButtonPress = () => {
    if (!workoutState.isWorking) {
      // Non in esecuzione: AVVIA
      startWorkout(training);
    } else if (workoutState.isPaused) {
      // In pausa: RIPRENDI
      resumeWorkout();
    } else {
      // In esecuzione: PAUSA
      pauseWorkout();
    }
  };

  // Calcola il tempo totale quando training cambia E non siamo in workout
  useEffect(() => {
    if (!workoutState.isWorking) {
      const totalTime =
        (training.timeWork * training.serial * training.cycles) +
        (training.timePause * (training.serial - 1) * training.cycles) +
        (training.timePauseCycle * (training.cycles - 1));
      setTimeRemaining(totalTime);
    }
  }, [training, workoutState.isWorking]);

  // Tempo da visualizzare
  const displayedTime = workoutState.isWorking
    ? workoutState.totalTimeRemaining
    : timeRemaining;

  // Helper per mostrare progresso serie
  const getSeriesDisplay = () => {
    if (!workoutState.isWorking) return training.serial.toString();
    return `${workoutState.currentSerial}/${training.serial}`;
  };

  // Helper per mostrare progresso cicli
  const getCyclesDisplay = () => {
    if (!workoutState.isWorking) return training.cycles.toString();
    return `${workoutState.currentCycle}/${training.cycles}`;
  };

  // Stili dinamici per dimensioni reattive
  const dynamicBigButton = {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: getPhaseColor(workoutState.phase, workoutState.isPaused),
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
      <ThemedText style={styles.totalTimeText}>
        Tempo totale: {formatTime(displayedTime)}
      </ThemedText>

      <TouchableOpacity
        style={[styles.bigButton, dynamicBigButton]}
        onPress={handleBigButtonPress}
        activeOpacity={0.8}
      >
        <View style={styles.bigButtonContent}>
          <ThemedText style={styles.phaseText}>
            {getPhaseLabel(workoutState.phase, workoutState.isPaused)}
          </ThemedText>

          {workoutState.isWorking && (
            <ThemedText style={styles.timerText}>
              {formatTime(workoutState.phaseTimeRemaining)}
            </ThemedText>
          )}

          {workoutState.phase === 'finished' && (
            <ThemedText style={styles.subText}>Tap per ricominciare</ThemedText>
          )}
        </View>
      </TouchableOpacity>

      <ThemedView style={styles.containerButton}>
        <SettingButtonTrayning
          style={[styles.smallButton, dynamicSmallButton, workoutState.isWorking && styles.disabledButton]}
          title="workTime"
          onPress={openModal}
        >
          <ThemedText style={dynamicSmallButtonText}>{training.timeWork}s</ThemedText>
        </SettingButtonTrayning>

        <SettingButtonTrayning
          style={[styles.smallButton, dynamicSmallButton, workoutState.isWorking && styles.disabledButton]}
          title="restTime"
          onPress={openModal}
        >
          <ThemedText style={dynamicSmallButtonText}>{training.timePause}s</ThemedText>
        </SettingButtonTrayning>

        <SettingButtonTrayning
          style={[styles.smallButton, dynamicSmallButton, workoutState.isWorking && styles.disabledButton]}
          title="seriesRest"
          onPress={openModal}
        >
          <ThemedText style={dynamicSmallButtonText}>{training.timePauseCycle}s</ThemedText>
        </SettingButtonTrayning>

        <SettingButtonTrayning
          style={[styles.smallButton, dynamicSmallButton, workoutState.isWorking && styles.disabledButton]}
          title="cycleRest"
          onPress={openModal}
        >
          <ThemedText style={dynamicSmallButtonText}>{training.timePauseCycle}s</ThemedText>
        </SettingButtonTrayning>

        <SettingButtonTrayning
          style={[styles.smallButton, dynamicSmallButton, workoutState.isWorking && styles.progressButton]}
          title="series"
          onPress={openModal}
        >
          <ThemedText style={dynamicSmallButtonText}>{getSeriesDisplay()}</ThemedText>
        </SettingButtonTrayning>

        <SettingButtonTrayning
          style={[styles.smallButton, dynamicSmallButton, workoutState.isWorking && styles.progressButton]}
          title="cycles"
          onPress={openModal}
        >
          <ThemedText style={dynamicSmallButtonText}>{getCyclesDisplay()}</ThemedText>
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
    alignItems: 'center', // allinea in orizzontale
    // justifyContent: 'center', // allinea in verticale 
    flex: 1,
    paddingBottom: 120, // Spazio per tab bar (70px) + margine (30px) + extra (20px)
  },
  totalTimeText: {
    fontSize: 18,
    marginBottom: 8,
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
  bigButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  timerText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  subText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  containerButton: {

    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  smallButton: {
    margin: 8,
    backgroundColor: '#4aa2ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  progressButton: {
    backgroundColor: '#4CAF50',
  },
});
