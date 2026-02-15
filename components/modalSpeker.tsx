// components/picker-modal.tsx
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from "./themed-view";

type PickerModalProps<T> = {
  visible: boolean;
  onClose: () => void;
  options: T[];
  selectedValue: T;
  onSelect: (value: T) => void;
  title?: string;
};

export function PickerModal<T extends string>({
  visible,
  onClose,
  options,
  selectedValue,
  onSelect,
  title,
}: PickerModalProps<T>) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <ThemedView
          style={styles.modalContent}
          lightColor={Colors.light.modalBackground}
          darkColor={Colors.dark.modalBackground}>

          {title && (
            <ThemedText style={styles.modalTitle}>{title}</ThemedText>
          )}

          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  { borderBottomColor: themeColors.border },
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}>
                <ThemedText
                  style={[
                    styles.modalItemText,
                    {
                      color: selectedValue === item
                        ? themeColors.primary
                        : themeColors.text
                    },
                  ]}>
                  {item}
                </ThemedText>
              </TouchableOpacity>
            )}
          />
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
    width: '80%',
    maxHeight: '60%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: 16,
    textAlign: 'center',
  },
});