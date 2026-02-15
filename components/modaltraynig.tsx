import { Colors } from "@/constants/theme";
import { SPEAKERS } from "@/context/SettingsContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Training } from "@/types/Training";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { PickerModal } from "./modalSpeker";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { TimeStepper } from "./TimeStepper";

type TrainingModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (training: Training) => void;
  training?: Partial<Training> | null; // null = nuovo, Partial = modifica
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
  title = "Nuovo Allenamento",
  showTitleandDescription = true,
}: TrainingModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const themeColors = Colors[colorScheme ?? 'light'];
  const { width, height } = useWindowDimensions();

  // Form state
  // Hook di stato per i dati del modulo proprietà di classe + Change Detection
  const [formData, setFormData] = useState<Training>(defaultTraining);
  const [showVoicePicker, setShowVoicePicker] = useState(false);

  // Aggiorna formData quando training cambia o modal si apre
  useEffect(() => {
    if (visible) {
      if (training) {
        setFormData({ ...defaultTraining, ...training });
      } else {
        setFormData(defaultTraining);
      }
    }
  }, [visible, training]);

  // Calcola tempo totale quando cambiano i valori
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

  // Questa funzione dice: "Prendi il campo X e aggiornalo con il valore Y, mantenendo tutto il resto uguale".
  const updateField = <K extends keyof Training>(
    field: K,
    value: Training[K],
  ) => {
    //value: Training[K]: Il valore corrispondente al tipo esatto di quel campo
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  //   Usa lo spread operator { ...prev } per copiare lo stato precedente.
  // Sostituisce solo il campo [field] con il nuovo value.
  // setFormData aggiorna lo stato in modo immutabile.

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: themeColors.inputBackground,
      color: themeColors.text,
      borderColor: themeColors.inputBorder,
    },
  ];

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <ThemedView
          style={[
            styles.modalContent,
            { width: width * 0.9, maxHeight: height * 0.85 },
          ]}
          lightColor={Colors.light.modalBackground}
          darkColor={Colors.dark.modalBackground}
        >
          <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <ThemedText style={styles.modalTitle}>{title}</ThemedText>

              {showTitleandDescription && (
                <>
                  {/* Titolo */}
                  <ThemedText style={styles.label}>Titolo</ThemedText>
                  <TextInput
                    style={inputStyle}
                    value={formData.title}
                    onChangeText={(text) => updateField("title", text)}
                    placeholder="Nome allenamento"
                    placeholderTextColor={themeColors.placeholder}
                  />

                  {/* Descrizione */}
                  <ThemedText style={styles.label}>Descrizione</ThemedText>
                  <TextInput
                    style={[inputStyle, styles.textArea]}
                    value={formData.description}
                    onChangeText={(text) => updateField("description", text)}
                    placeholder="Descrizione opzionale"
                    placeholderTextColor={themeColors.placeholder}
                    multiline
                    numberOfLines={3}
                  />
                </>
              )}

              {/* Numero di serie */}
              <ThemedText style={styles.label}>Numero di serie</ThemedText>
              <TextInput
                style={inputStyle}
                value={formData.serial.toString()}
                onChangeText={(text) =>
                  updateField("serial", parseInt(text) || 1)
                }
                keyboardType="numeric"
                placeholder="8"
                placeholderTextColor={themeColors.placeholder}
              />

              {/* Numero di cicli */}
              <ThemedText style={styles.label}>Numero di cicli</ThemedText>
              <TextInput
                style={inputStyle}
                value={formData.cycles.toString()}
                onChangeText={(text) =>
                  updateField("cycles", parseInt(text) || 1)
                }
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor={themeColors.placeholder}
              />

              {/* Tempo lavoro */}
              <ThemedText style={styles.label}>Tempo lavoro</ThemedText>
              <TimeStepper
                value={formData.timeWork}
                onChange={(v) => updateField("timeWork", v)}
                isDark={isDark}
              />

              {/* Tempo pausa */}
              <ThemedText style={styles.label}>Tempo pausa</ThemedText>
              <TimeStepper
                value={formData.timePause}
                onChange={(v) => updateField("timePause", v)}
                isDark={isDark}
              />

              {/* Tempo pausa ciclo */}
              <ThemedText style={styles.label}>Tempo pausa ciclo</ThemedText>
              <TimeStepper
                value={formData.timePauseCycle}
                onChange={(v) => updateField("timePauseCycle", v)}
                isDark={isDark}
              />
              {/* Voce attiva */}
              <View style={styles.switchRow}>
                <ThemedText style={styles.label}>Voce attiva</ThemedText>
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
                  <ThemedText style={styles.label}>Voce</ThemedText>
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
                    title="Seleziona Voce"
                  />
                </>
              )}

              {/* Pulsanti azione */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: themeColors.destructive }]}
                  onPress={onClose}
                >
                  <ThemedText style={styles.buttonText}>
                    Annulla
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: themeColors.primary }]}
                  onPress={handleSave}
                >
                  <ThemedText style={[styles.buttonText, { color: themeColors.textOnPrimary }]}>Salva</ThemedText>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </ThemedView>
      </TouchableOpacity>
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
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    marginTop: 12,
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
  voiceOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  voiceOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  totalTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalTimeValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00A896",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
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
