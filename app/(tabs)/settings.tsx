import { Card } from '@/components/Card';
import { SettingRow } from '@/components/SettingRow';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet, Switch } from 'react-native';

export default function TabTwoScreen() {
  //Sono come le variabili di stato di un compinente Angualr  


  return (
  <ThemedView>
    <ThemedView> 
      <ThemedText >Impostazioni</ThemedText>
      {/* Sezione Aspetto */}
      <Card title="Aspetto">
        <SettingRow label="Modalità Scura">
          <Switch
          // trackColor={{ false: '#767577', true: 'green' }}
          // onValueChange={toggleTheme}
          // value={theme === 'dark'}
          />
        </SettingRow>
      </Card>

      {/* Sezione Suoni */}
      <Card title="Suoni">
        <SettingRow label="Voci Abilitate">
          <Switch
          trackColor={{ false: '#767577', true: 'green' }}
          value={true}
          />
        </SettingRow>
        {/* manca la ricerca voe TODO  */}
        <SettingRow label="Volume">
          <ThemedView  lightColor="transparent" darkColor="transparent">
            <ThemedText ></ThemedText>
              {/* <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor={theme === 'dark' ? '#555' : '#A9A9A9'}
                thumbTintColor="#007AFF"
                value={volume}
                onValueChange={setVolume}
                step={0.01} */}
              {/* /> */}
          </ThemedView>
        </SettingRow>
      </Card>
      <ThemedText >Versione: 0.0.0</ThemedText>
    </ThemedView>    
  </ThemedView>
  );
}

const styles = StyleSheet.create({
});
