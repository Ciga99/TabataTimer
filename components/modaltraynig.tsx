import { SPEAKERS } from '@/context/SettingsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Training } from '@/types/Training';
import { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { PickerModal } from './modalSpeker';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type TrainingModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (training: Training) => void;
  training?: Partial<Training> | null; // null = nuovo, Partial = modifica
  title?: string;
};

const defaultTraining: Training = {
  title: '',
  description: '',
  cycles: 1,
  serial: 8,
  timeWork: 30,
  timePause: 30,
  timePauseCycle: 30,
  timeTotal: 0,
  voice: 'Alice',
  isVoiceEnabled: true,
};

export function TrainingModal({
  visible,
  onClose,
  onSave,
  training,
  title = 'Nuovo Allenamento',
}: TrainingModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
      formData.cycles * (
        formData.serial * (formData.timeWork + formData.timePause) - formData.timePause + formData.timePauseCycle
      ) - formData.timePauseCycle;

    setFormData(prev => ({ ...prev, timeTotal: Math.max(0, totalTime) }));
  }, [formData.cycles, formData.serial, formData.timeWork, formData.timePause, formData.timePauseCycle]);

  // Questa funzione dice: "Prendi il campo X e aggiornalo con il valore Y, mantenendo tutto il resto uguale".
  const updateField = <K extends keyof Training>(field: K, value: Training[K]) => {//value: Training[K]: Il valore corrispondente al tipo esatto di quel campo
    setFormData(prev => ({ ...prev, [field]: value }));
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
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: isDark ? '#3a3a3c' : '#f2f2f7',
      color: isDark ? 'white' : 'black',
      borderColor: isDark ? '#555' : '#ddd',
    }
  ];

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <ThemedView
          style={styles.modalContent}
          lightColor="#fff"
          darkColor="#2c2c2e">
          <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <ThemedText style={styles.modalTitle}>{title}</ThemedText>

              {/* Titolo */}
              <ThemedText style={styles.label}>Titolo</ThemedText>
              <TextInput
                style={inputStyle}
                value={formData.title}
                onChangeText={(text) => updateField('title', text)}
                placeholder="Nome allenamento"
                placeholderTextColor={isDark ? '#888' : '#999'}
              />

              {/* Descrizione */}
              <ThemedText style={styles.label}>Descrizione</ThemedText>
              <TextInput
                style={[inputStyle, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => updateField('description', text)}
                placeholder="Descrizione opzionale"
                placeholderTextColor={isDark ? '#888' : '#999'}
                multiline
                numberOfLines={3}
              />

              {/* Numero di serie */}
              <ThemedText style={styles.label}>Numero di serie</ThemedText>
              <TextInput
                style={inputStyle}
                value={formData.serial.toString()}
                onChangeText={(text) => updateField('serial', parseInt(text) || 1)}
                keyboardType="numeric"
                placeholder="8"
                placeholderTextColor={isDark ? '#888' : '#999'}
              />

              {/* Numero di cicli */}
              <ThemedText style={styles.label}>Numero di cicli</ThemedText>
              <TextInput
                style={inputStyle}
                value={formData.cycles.toString()}
                onChangeText={(text) => updateField('cycles', parseInt(text) || 1)}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor={isDark ? '#888' : '#999'}
              />

              {/* Tempo lavoro (secondi) */}
              <ThemedText style={styles.label}>Tempo lavoro (secondi)</ThemedText>
              <TextInput
                style={inputStyle}
                value={formData.timeWork.toString()}
                onChangeText={(text) => updateField('timeWork', parseInt(text) || 0)}
                keyboardType="numeric"
                placeholder="30"
                placeholderTextColor={isDark ? '#888' : '#999'}
              />

              {/* Tempo pausa (secondi) */}
              <ThemedText style={styles.label}>Tempo pausa (secondi)</ThemedText>
              <TextInput
                style={inputStyle}
                value={formData.timePause.toString()}
                onChangeText={(text) => updateField('timePause', parseInt(text) || 0)}
                keyboardType="numeric"
                placeholder="30"
                placeholderTextColor={isDark ? '#888' : '#999'}
              />

              {/* Tempo pausa ciclo (secondi) */}
              <ThemedText style={styles.label}>Tempo pausa ciclo (secondi)</ThemedText>
              <TextInput
                style={inputStyle}
                value={formData.timePauseCycle.toString()}
                onChangeText={(text) => updateField('timePauseCycle', parseInt(text) || 0)}
                keyboardType="numeric"
                placeholder="30"
                placeholderTextColor={isDark ? '#888' : '#999'}
              />

              {/* Tempo totale (calcolato) */}
              <View style={styles.totalTimeContainer}>
                <ThemedText style={styles.label}>Tempo totale allenamento</ThemedText>
                <ThemedText style={styles.totalTimeValue}>
                  {formatTime(formData.timeTotal)}
                </ThemedText>
              </View>

              {/* Voce attiva */}
              <View style={styles.switchRow}>
                <ThemedText style={styles.label}>Voce attiva</ThemedText>
                <Switch
                  value={formData.isVoiceEnabled}
                  onValueChange={(value) => updateField('isVoiceEnabled', value)}
                  trackColor={{ false: '#767577', true: '#007AFF' }}
                  thumbColor={formData.isVoiceEnabled ? '#fff' : '#f4f3f4'}
                />
              </View>

              {/* Selettore voce */}
              {formData.isVoiceEnabled && (
                <>
                  <ThemedText style={styles.label}>Voce</ThemedText>
                  <TouchableOpacity
                    style={[inputStyle, styles.pickerButton]}
                    onPress={() => setShowVoicePicker(!showVoicePicker)}>
                    <ThemedText>{formData.voice}</ThemedText>
                  </TouchableOpacity>

                  <PickerModal
                    visible={showVoicePicker}
                    onClose={() => setShowVoicePicker(false)}
                    options={SPEAKERS}
                    selectedValue={formData.voice}
                    onSelect={(value) => updateField('voice', value)}
                    title="Seleziona Voce"
                  />
                </>
              )}

              {/* Pulsanti azione */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}>
                  <ThemedText style={styles.cancelButtonText}>Annulla</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSave}>
                  <ThemedText style={styles.saveButtonText}>Salva</ThemedText>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
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
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  pickerButton: {
    justifyContent: 'center',
  },
  voiceOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  voiceOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  totalTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalTimeValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
