import { Colors } from "@/constants/theme";
import { SPEAKERS } from "@/context/SettingsContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslation } from "@/hooks/use-translation";
import { Training } from "@/types/Training";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PickerModal } from "./modalSpeker";
import { NumberStepper } from "./NumberStepper";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { TimeStepper } from "./TimeStepper";

type TrainingModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (training: Training) => void;
  training?: Partial<Training> | null;
  title?: string;
  showTitleandDescription?: boolean;
};

const defaultTraining: Training = {
  title: "",
  description: "",
  cycles: 1,
  serial: 8,
  timeWork: 30,
  timePause: 30,
  timePauseCycle: 30,
  timeTotal: 0,
  voice: "Donna",
  isVoiceEnabled: true,
};

export function TrainingModal({
  visible,
  onClose,
  onSave,
  training,
  title,
  showTitleandDescription = true,
}: TrainingModalProps) {
  const colorScheme = useColorScheme();
  const t = useTranslation();
  const isDark = colorScheme === "dark";
  const themeColors = Colors[colorScheme ?? "light"];
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState<Training>(defaultTraining);
  const [showVoicePicker, setShowVoicePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      if (training) {
        setFormData({ ...defaultTraining, ...training });
      } else {
        setFormData(defaultTraining);
      }
    }
  }, [visible, training]);

  useEffect(() => {
    const totalTime =
      formData.cycles *
        (formData.serial * (formData.timeWork + formData.timePause) -
          formData.timePause +
          formData.timePauseCycle) -
      formData.timePauseCycle;
    setFormData((prev) => ({ ...prev, timeTotal: Math.max(0, totalTime) }));
  }, [
    formData.cycles,
    formData.serial,
    formData.timeWork,
    formData.timePause,
    formData.timePauseCycle,
  ]);

  const updateField = <K extends keyof Training>(
    field: K,
    value: Training[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: themeColors.inputBackground,
      color: themeColors.text,
      borderColor: themeColors.inputBorder,
    },
  ];

  // Altezza fissa per permettere lo scroll interno (ScrollView con flex:1)
  const modalHeight = height * 0.85 - insets.top - insets.bottom;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        {/* Tap fuori dal modal per chiudere (dietro al contenuto) */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* behavior="padding" sposta il modal in su senza restringerlo */}
        <KeyboardAvoidingView behavior="padding" style={{ width: width * 0.9 }}>
          <ThemedView
            style={[styles.modalContent, { height: modalHeight }]}
            lightColor={Colors.light.modalBackground}
            darkColor={Colors.dark.modalBackground}
          >
            {/* Titolo fisso */}
            <ThemedText style={styles.modalTitle}>
              {title ?? t.newTraining}
            </ThemedText>

            {/* Contenuto scrollabile — flex:1 funziona perché il parent ha height fissa */}
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {showTitleandDescription && (
                <>
                  <ThemedText style={styles.label}>{t.fieldTitle}</ThemedText>
                  <TextInput
                    style={inputStyle}
                    value={formData.title}
                    onChangeText={(text) => updateField("title", text)}
                    placeholder={t.titlePlaceholder}
                    placeholderTextColor={themeColors.placeholder}
                  />

                  <ThemedText style={styles.label}>
                    {t.fieldDescription}
                  </ThemedText>
                  <TextInput
                    style={[inputStyle, styles.textArea]}
                    value={formData.description}
                    onChangeText={(text) => updateField("description", text)}
                    placeholder={t.descriptionPlaceholder}
                    placeholderTextColor={themeColors.placeholder}
                    multiline
                    numberOfLines={3}
                  />
                </>
              )}

              {/* Numero di serie */}
              <ThemedText style={styles.label}>{t.numberOfSeries}</ThemedText>
              <NumberStepper
                value={formData.serial}
                onChange={(v) => updateField("serial", v)}
                min={1}
                max={99}
              />

              {/* Numero di cicli */}
              <ThemedText style={styles.label}>{t.numberOfCycles}</ThemedText>
              <NumberStepper
                value={formData.cycles}
                onChange={(v) => updateField("cycles", v)}
                min={1}
                max={99}
              />

              {/* Tempo lavoro */}
              <ThemedText style={styles.label}>{t.workTimeLabel}</ThemedText>
              <TimeStepper
                value={formData.timeWork}
                onChange={(v) => updateField("timeWork", v)}
                isDark={isDark}
              />

              {/* Tempo pausa */}
              <ThemedText style={styles.label}>{t.pauseTimeLabel}</ThemedText>
              <TimeStepper
                value={formData.timePause}
                onChange={(v) => updateField("timePause", v)}
                isDark={isDark}
              />

              {/* Tempo pausa ciclo */}
              <ThemedText style={styles.label}>
                {t.cyclePauseTimeLabel}
              </ThemedText>
              <TimeStepper
                value={formData.timePauseCycle}
                onChange={(v) => updateField("timePauseCycle", v)}
                isDark={isDark}
              />

              {/* Voce attiva */}
              <View style={styles.switchRow}>
                <ThemedText style={styles.label}>{t.voiceActive}</ThemedText>
                <Switch
                  value={formData.isVoiceEnabled}
                  onValueChange={(value) =>
                    updateField("isVoiceEnabled", value)
                  }
                  trackColor={{ false: "#767577", true: themeColors.primary }}
                  thumbColor={formData.isVoiceEnabled ? "#fff" : "#f4f3f4"}
                />
              </View>

              {/* Selettore voce */}
              {formData.isVoiceEnabled && (
                <>
                  <ThemedText style={styles.label}>{t.voice}</ThemedText>
                  <TouchableOpacity
                    style={[inputStyle, styles.pickerButton]}
                    onPress={() => setShowVoicePicker(!showVoicePicker)}
                  >
                    <ThemedText>{formData.voice}</ThemedText>
                  </TouchableOpacity>

                  <PickerModal
                    visible={showVoicePicker}
                    onClose={() => setShowVoicePicker(false)}
                    options={SPEAKERS}
                    selectedValue={formData.voice}
                    onSelect={(value) => updateField("voice", value)}
                    title={t.selectVoice}
                  />
                </>
              )}
            </ScrollView>

            {/* Pulsanti fissi in fondo — sempre visibili */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: themeColors.destructive },
                ]}
                onPress={onClose}
              >
                <ThemedText style={styles.buttonText}>{t.cancel}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: themeColors.primary },
                ]}
                onPress={handleSave}
              >
                <ThemedText
                  style={[
                    styles.buttonText,
                    { color: themeColors.textOnPrimary },
                  ]}
                >
                  {t.save}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 26,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    marginTop: 12,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  pickerButton: {
    justifyContent: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
