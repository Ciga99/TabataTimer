import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type TimeStepperProps = {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  isDark: boolean;
};

export function TimeStepper({
  value,
  onChange,
  step = 5,
  min = 5,
  max = 3599,
  isDark,
}: TimeStepperProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const [showModal, setShowModal] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('');
  const [inputSeconds, setInputSeconds] = useState('');

  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleDecrement = () => {
    const newValue = value - step;
    onChange(Math.max(min, newValue));
  };

  const handleIncrement = () => {
    const newValue = value + step;
    onChange(Math.min(max, newValue));
  };

  const openModal = () => {
    setInputMinutes(minutes.toString());
    setInputSeconds(seconds.toString());
    setShowModal(true);
  };

  const handleConfirm = () => {
    const mins = parseInt(inputMinutes) || 0;
    const secs = parseInt(inputSeconds) || 0;
    const clampedMins = Math.min(59, Math.max(0, mins));
    const clampedSecs = Math.min(59, Math.max(0, secs));
    let total = clampedMins * 60 + clampedSecs;
    total = Math.max(min, Math.min(max, total));
    onChange(total);
    setShowModal(false);
  };

  const btnBg = themeColors.secondary;
  const btnColor = themeColors.text;
  const inputBg = themeColors.inputBackground;
  const inputColor = themeColors.text;
  const inputBorder = themeColors.inputBorder;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.stepButton, { backgroundColor: btnBg }]}
        onPress={handleDecrement}
        disabled={value <= min}
      >
        <ThemedText style={[styles.stepButtonText, { color: btnColor, opacity: value <= min ? 0.3 : 1 }]}>−</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.timeDisplay} onPress={openModal}>
        <ThemedText style={styles.timeText}>{displayTime}</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.stepButton, { backgroundColor: btnBg }]}
        onPress={handleIncrement}
        disabled={value >= max}
      >
        <ThemedText style={[styles.stepButtonText, { color: btnColor, opacity: value >= max ? 0.3 : 1 }]}>+</ThemedText>
      </TouchableOpacity>

      <Modal transparent visible={showModal} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <ThemedView
            style={styles.modalContent}
            lightColor={Colors.light.modalBackground}
            darkColor={Colors.dark.modalBackground}
          >
            <TouchableOpacity activeOpacity={1}>
              <ThemedText style={styles.modalTitle}>Inserisci tempo</ThemedText>

              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>Minuti</ThemedText>
                  <TextInput
                    style={[styles.timeInput, { backgroundColor: inputBg, color: inputColor, borderColor: inputBorder }]}
                    value={inputMinutes}
                    onChangeText={setInputMinutes}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="0"
                    placeholderTextColor={themeColors.placeholder}
                    selectTextOnFocus
                  />
                </View>

                <ThemedText style={styles.separator}>:</ThemedText>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>Secondi</ThemedText>
                  <TextInput
                    style={[styles.timeInput, { backgroundColor: inputBg, color: inputColor, borderColor: inputBorder }]}
                    value={inputSeconds}
                    onChangeText={setInputSeconds}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="0"
                    placeholderTextColor={themeColors.placeholder}
                    selectTextOnFocus
                  />
                </View>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: themeColors.destructive }]}
                  onPress={() => setShowModal(false)}
                >
                  <ThemedText style={styles.buttonText}>Annulla</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: themeColors.primary }]}
                  onPress={handleConfirm}
                >
                  <ThemedText style={[styles.buttonText, { color: themeColors.textOnPrimary }]}>Conferma</ThemedText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </ThemedView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  timeDisplay: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  timeText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 280,
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  inputGroup: {
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.7,
  },
  timeInput: {
    width: 80,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  separator: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
