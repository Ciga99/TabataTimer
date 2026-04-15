import { SettingButtonTrayning } from "@/components/homeComponents/smallbutton";
import { TrainingModal } from "@/components/modaltraynig";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { TranslationKeys } from "@/constants/translations";
import { useAudio } from "@/context/AudioContext";
import { useSettings } from "@/context/SettingsContext";
import { useTraining } from "@/context/TrainingContext";
import { useWorkout, WorkoutPhase } from "@/context/WorkoutContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useResponsive } from "@/hooks/use-responsive";
import { useTranslation } from "@/hooks/use-translation";
import { Training } from "@/types/Training";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
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
  const { voiceActive, setVoiceActive } = useSettings();
  const { workoutState, startWorkout, pauseWorkout, resumeWorkout } =
    useWorkout();
  const { playUserAction } = useAudio();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { width, height, isLargeScreen, contentMaxWidth, tabBarBottomPadding } = useResponsive();
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
    setVoiceActive(updatedTraining.isVoiceEnabled);
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

  const dynamicPadding = tabBarBottomPadding;

  const getButtonSizeWidth = () => {
    // Limitato dalla larghezza contenuto (già cappata a 900/700) oppure 90% schermo
    const maxW = contentMaxWidth ?? width;
    return Math.min(800, maxW * 0.9);
  };

  const getButtonSizeHeight = () => {
    // Su schermi grandi (tablet/desktop) il bottone non deve dominare lo schermo
    if (isLargeScreen) {
      return Math.min(350, height * 0.28);
    }
    // Mobile piccolo (iPhone SE, h < 700)
    if (height < 700) {
      return height * 0.35;
    }
    // Mobile standard
    return Math.min(320, height * 0.38);
  };

  const getSmallButtonSize = () => {
    if (isLargeScreen) {
      return Math.min(110, height * 0.12);
    }
    if (height >= 700) {
      return height * 0.09;
    }
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
    <ThemedView style={styles.outerContainer}>
      <ThemedView style={[
        styles.container,
        { paddingBottom: dynamicPadding },
        isLargeScreen && { maxWidth: contentMaxWidth ?? 900, alignSelf: 'center', width: '100%' },
      ]}>
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
        training={{ ...training, isVoiceEnabled: voiceActive }}
        title={t.editTraining}
        showTitleandDescription={false}
      />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
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
