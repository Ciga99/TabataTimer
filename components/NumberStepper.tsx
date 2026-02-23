import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/use-translation';
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

type NumberStepperProps = {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
};

export function NumberStepper({
  value,
  onChange,
  step = 1,
  min = 1,
  max = 99,
}: NumberStepperProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const t = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleDecrement = () => onChange(Math.max(min, value - step));
  const handleIncrement = () => onChange(Math.min(max, value + step));

  const openModal = () => {
    setInputValue(value.toString());
    setShowModal(true);
  };

  const handleConfirm = () => {
    const parsed = parseInt(inputValue) || min;
    onChange(Math.max(min, Math.min(max, parsed)));
    setShowModal(false);
  };

  const btnBg = themeColors.secondary;
  const btnColor = themeColors.text;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.stepButton, { backgroundColor: btnBg }]}
        onPress={handleDecrement}
        disabled={value <= min}
      >
        <ThemedText style={[styles.stepButtonText, { color: btnColor, opacity: value <= min ? 0.3 : 1 }]}>
          −
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.valueDisplay} onPress={openModal}>
        <ThemedText style={styles.valueText}>{value}</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.stepButton, { backgroundColor: btnBg }]}
        onPress={handleIncrement}
        disabled={value >= max}
      >
        <ThemedText style={[styles.stepButtonText, { color: btnColor, opacity: value >= max ? 0.3 : 1 }]}>
          +
        </ThemedText>
      </TouchableOpacity>

      <Modal transparent visible={showModal} animationType="fade" statusBarTranslucent>
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
              <ThemedText style={styles.modalTitle}>{t.enterNumber}</ThemedText>
              <TextInput
                style={[styles.input, {
                  backgroundColor: themeColors.inputBackground,
                  color: themeColors.text,
                  borderColor: themeColors.inputBorder,
                }]}
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType="numeric"
                maxLength={3}
                placeholder={min.toString()}
                placeholderTextColor={themeColors.placeholder}
                selectTextOnFocus
                autoFocus
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: themeColors.destructive }]}
                  onPress={() => setShowModal(false)}
                >
                  <ThemedText style={styles.buttonText}>{t.cancel}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: themeColors.primary }]}
                  onPress={handleConfirm}
                >
                  <ThemedText style={[styles.buttonText, { color: themeColors.textOnPrimary }]}>
                    {t.confirm}
                  </ThemedText>
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
  valueDisplay: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  valueText: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 260,
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 12,
    lineHeight: 36,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
