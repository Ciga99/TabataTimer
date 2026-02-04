import { SettingButtonTrayning } from '@/components/homeComponents/smallbutton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const buttonSize = screenWidth - 16; // 8px margin per lato
const smallButtonSize = (screenWidth / 6) - 16; // 7 bottoni con margin 8px per lato

export default function TabTwoScreen() {
  return (
    <ThemedView style={styles.container}>
       <ThemedText>Tempo rimanente: 23:00</ThemedText>
      <TouchableOpacity 
        style={styles.bigButton}
        onPress={() => console.log('Premuto!')}
      >
        <ThemedText >PREMI</ThemedText>
      </TouchableOpacity>

      <ThemedView style={styles.containerButton}>
        <SettingButtonTrayning style={styles.smallButton}  title="workTime">
          <ThemedText style={styles.smallButtonText} >12:00</ThemedText>
        </SettingButtonTrayning>
        <SettingButtonTrayning style={styles.smallButton}  title="restTIME">
          <ThemedText style={styles.smallButtonText} >12:00</ThemedText>
        </SettingButtonTrayning>
        <SettingButtonTrayning style={styles.smallButton}  title="seriesNumber">
          <ThemedText style={styles.smallButtonText}>12:00</ThemedText>
        </SettingButtonTrayning>
        <SettingButtonTrayning style={styles.smallButton}  title="seriesREst">
          <ThemedText style={styles.smallButtonText}>12:00</ThemedText>
        </SettingButtonTrayning>
        <SettingButtonTrayning style={styles.smallButton}  title="circleNumber">
          <ThemedText  style={styles.smallButtonText}>12:00</ThemedText>
        </SettingButtonTrayning>
        <SettingButtonTrayning style={styles.smallButton}  title="circleRest">
          <ThemedText style={styles.smallButtonText}>12:00</ThemedText>
        </SettingButtonTrayning>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  bigButton: {
    margin: 8,
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2, // La metà di width/height per renderlo perfettamente rotondo
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
  },
  smallButton: {
    margin: 8,
    width: smallButtonSize,
    height: smallButtonSize,
    // borderRadius: smallButtonSize / 2,s
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  smallButtonText: {
    fontSize: smallButtonSize * 0.25, // Testo proporzionale alla dimensione del bottone
  }
});
