import { SettingButtonTrayning } from "@/components/homeComponents/smallbutton";
import { TrainingModal } from "@/components/modaltraynig";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { TranslationKeys } from "@/constants/translations";
import { useAudio } from "@/context/AudioContext";
import { useTraining } from "@/context/TrainingContext";
import { useWorkout, WorkoutPhase } from "@/context/WorkoutContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslation } from "@/hooks/use-translation";
import { Training } from "@/types/Training";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { formatTime } from "../helper";

// Helper per il testo della fase
const getPhaseLabel = (
  phase: WorkoutPhase,
  isPaused: boolean,
  t: TranslationKeys,
): string => {
  if (isPaused) return t.phasePaused;
  switch (phase) {
    case "work":
      return t.phaseWork;
    case "rest":
      return t.phaseRest;
    case "cycle_rest":
      return t.phaseCycleRest;
    case "finished":
      return t.phaseFinished;
    default:
      return t.phasePress;
  }
};

// Helper per il colore della fase (theme-aware)
const getPhaseColor = (
  phase: WorkoutPhase,
  isPaused: boolean,
  primary: string,
): string => {
  if (isPaused) return "#9E9E9E";
  switch (phase) {
    case "work":
      return "#4CAF50";
    case "rest":
      return "#FF9800";
    case "cycle_rest":
      return "#f0f321";
    case "finished":
      return "#3027b0";
    default:
      return primary;
  }
};

export default function TabTwoScreen() {
  const [orientation, setOrientation] =
    useState<ScreenOrientation.Orientation | null>(null);
  const { training, setTraining } = useTraining();
  const { workoutState, startWorkout, pauseWorkout, resumeWorkout } =
    useWorkout();
  const { playUserAction } = useAudio();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { width, height } = useWindowDimensions();
  const t = useTranslation();
  const [timeRemaining, setTimeRemaining] = useState(0);

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

  // // Handler per il bottone grande
  const handleBigButtonPress = () => {
    if (!workoutState.isWorking) {
      // Non in esecuzione: AVVIA
      playUserAction("start");
      startWorkout(training);
    } else if (workoutState.isPaused) {
      // In pausa: RIPRENDI
      playUserAction("resume");
      resumeWorkout();
    } else {
      // In esecuzione: PAUSA
      playUserAction("pause");
      pauseWorkout();
    }
  };

  useEffect(() => {
    // 1. Controlla l'orientamento iniziale
    const checkOrientation = async () => {
      const current = await ScreenOrientation.getOrientationAsync();
      setOrientation(current);
    };
    checkOrientation();

    // 2. Ascolta i cambiamenti futuri
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        setOrientation(event.orientationInfo.orientation);
      },
    );
    return () =>
      ScreenOrientation.removeOrientationChangeListener(subscription);
  }, []);

  // Verifica se siamo in landscape
  let isLandscape =
    orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
    orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

  // Calcola il tempo totale quando training cambia E non siamo in workout
  useEffect(() => {
    if (!workoutState.isWorking) {
      const totalTime =
        training.timeWork * training.serial * training.cycles +
        training.timePause * (training.serial - 1) * training.cycles +
        training.timePauseCycle * (training.cycles - 1);
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

  // Calcolo di min(80, 8% della larghezza)
  // const dynamicPadding = Math.min(10, width * 0.08);
  const dynamicPadding = 90;

  const getButtonSizeWidth = () => {
    return Math.min(800, width * 0.9);
    // // 1. TABLET (o Landscape molto largo)
    // if (width >= 768) {
    //   return width * 0.90; // Su tablet non vogliamo il bottone gigante, 30% altezza basta
    // }
    // // 2. MOBILE STANDARD (iPhone 13, 14, Galaxy S23 ecc.)
    // if (width >= 700) {
    //   return width * 0.45; // Dimensione generosa per schermi lunghi
    // }
    // // 3. MOBILE PICCOLO (iPhone SE, vecchi modelli)
    // return width * 0.9;
  };

  const getButtonSizeHeight = () => {
    // 1. TABLET (o Landscape molto largo)
    if (height >= 768) {
      return height * 0.3; // Su tablet non vogliamo il bottone gigante, 30% altezza basta
    }
    // 2. MOBILE STANDARD (iPhone 13, 14, Galaxy S23 ecc.)
    if (height >= 700) {
      return height * 0.4; // Dimensione generosa per schermi lunghi
    }
    // 3. MOBILE PICCOLO (iPhone SE, vecchi modelli)
    return height * 0.35;
  };

  const getSmallButtonSize = () => {
    // 1. TABLET (o Landscape molto largo)
    // Generalmente width > 600 indica un tablet in portrait o uno smartphone in landscape
    if (width >= 768) {
      return height * 0.2; // Su tablet non vogliamo il bottone gigante, 30% altezza basta
    }
    // 2. MOBILE STANDARD (iPhone 13, 14, Galaxy S23 ecc.)
    // Altezza tipica sopra i 700dp
    if (height >= 700) {
      return height * 0.09; // Dimensione generosa per schermi lunghi
    }
    // 3. MOBILE PICCOLO (iPhone SE, vecchi modelli)
    // Altezza sotto i 700dp
    return height * 0.1;
  };
  // Stili dinamici per dimensioni reattive
  const dynamicBigButton = {
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    width: getButtonSizeWidth(),
    height: getButtonSizeHeight(),
    borderRadius: 20,
    backgroundColor: getPhaseColor(
      workoutState.phase,
      workoutState.isPaused,
      colors.primary,
    ),
  };

  const dynamicSmallButton = {
    width: getSmallButtonSize(),
    height: getSmallButtonSize(),
  };

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const dynamicSmallButtonText = {
    fontSize: clamp(width * 0.07 + 16, 12, 24),
  };

  const timerFontSize = Math.min(56, getButtonSizeHeight() * 0.5);

  return (
    <ThemedView style={[styles.container, { paddingBottom: dynamicPadding }]}>
      <ThemedText style={styles.totalTimeText}>
        {t.totalTime}: {formatTime(displayedTime)}
      </ThemedText>

      <TouchableOpacity
        style={dynamicBigButton}
        onPress={handleBigButtonPress}
        activeOpacity={0.8}
      >
        <View style={styles.bigButtonContent}>
          <ThemedText style={styles.phaseText}>
            {getPhaseLabel(workoutState.phase, workoutState.isPaused, t)}
          </ThemedText>

          {workoutState.isWorking && (
            <ThemedText
              style={[
                styles.timerText,
                { fontSize: timerFontSize, lineHeight: timerFontSize * 1.2 },
              ]}
            >
              {formatTime(workoutState.phaseTimeRemaining)}
            </ThemedText>
          )}

          {workoutState.phase === "finished" && (
            <ThemedText style={styles.subText}>{t.tapToRestart}</ThemedText>
          )}
        </View>
      </TouchableOpacity>
      {/* {!isLandscape && (    */}
      {/* // <>   */}
      <ThemedView style={styles.containerButton}>
        <SettingButtonTrayning
          style={[
            styles.smallButton,
            dynamicSmallButton,
            { backgroundColor: colors.secondary },
            workoutState.isWorking && styles.disabledButton,
          ]}
          title={t.btnWorkTime}
          onPress={openModal}
        >
          <ThemedText style={[dynamicSmallButtonText, { color: colors.text }]}>
            {training.timeWork}s
          </ThemedText>
        </SettingButtonTrayning>

        <SettingButtonTrayning
          style={[
            styles.smallButton,
            dynamicSmallButton,
            { backgroundColor: colors.secondary },
            workoutState.isWorking && styles.disabledButton,
          ]}
          title={t.btnRestTime}
          onPress={openModal}
        >
          <ThemedText style={[dynamicSmallButtonText, { color: colors.text }]}>
            {training.timePause}s
          </ThemedText>
        </SettingButtonTrayning>

        <SettingButtonTrayning
          style={[
            styles.smallButton,
            dynamicSmallButton,
            { backgroundColor: colors.secondary },
            workoutState.isWorking && styles.disabledButton,
          ]}
          title={t.btnSeriesRest}
          onPress={openModal}
        >
          <ThemedText style={[dynamicSmallButtonText, { color: colors.text }]}>
            {training.timePauseCycle}s
          </ThemedText>
        </SettingButtonTrayning>

        <SettingButtonTrayning
          style={[
            styles.smallButton,
            dynamicSmallButton,
            { backgroundColor: colors.secondary },
            workoutState.isWorking && styles.disabledButton,
          ]}
          title={t.btnCycleRest}
          onPress={openModal}
        >
          <ThemedText style={[dynamicSmallButtonText, { color: colors.text }]}>
            {training.timePauseCycle}s
          </ThemedText>
        </SettingButtonTrayning>

        <SettingButtonTrayning
          style={[
            styles.smallButton,
            dynamicSmallButton,
            { backgroundColor: colors.primary },
            workoutState.isWorking && styles.progressButton,
          ]}
          title={t.btnSeries}
          onPress={openModal}
        >
          <ThemedText
            style={[dynamicSmallButtonText, { color: colors.textOnPrimary }]}
          >
            {getSeriesDisplay()}
          </ThemedText>
        </SettingButtonTrayning>

        <SettingButtonTrayning
          style={[
            styles.smallButton,
            dynamicSmallButton,
            { backgroundColor: colors.primary },
            workoutState.isWorking && styles.progressButton,
          ]}
          title={t.btnCycles}
          onPress={openModal}
        >
          <ThemedText
            style={[dynamicSmallButtonText, { color: colors.textOnPrimary }]}
          >
            {getCyclesDisplay()}
          </ThemedText>
        </SettingButtonTrayning>
      </ThemedView>

      <TrainingModal
        visible={isModalVisible}
        onClose={closeModal}
        onSave={handleSaveTraining}
        training={training}
        title={t.editTraining}
        showTitleandDescription={false}
      />
      {/* </>  */}
      {/* )} */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  totalTimeText: {
    fontSize: 18,
    marginBottom: 8,
  },
  // bigButton: {
  //   margin: 8,
  //   backgroundColor: '#007AFF',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 5,
  //   elevation: 8,
  // },
  bigButtonContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  phaseText: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  timerText: {
    fontSize: 56,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  subText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 8,
  },
  containerButton: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    padding: 10,
  },
  smallButton: {
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    flexGrow: 1, // Fa sì che il bottone occupi lo spazio rimanente
    minWidth: 100, // Se lo schermo è stretto, non scende sotto i 100px
    maxWidth: "100%",
  },
  disabledButton: {
    opacity: 0.5,
  },
  progressButton: {
    opacity: 0.8,
  },
});
