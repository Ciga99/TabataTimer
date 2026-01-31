import { Card } from '@/components/Card';
import { PickerModal } from '@/components/modalSpeker';
import { SettingRow } from '@/components/SettingRow';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LANGUAGES, SPEAKERS, useSettings } from '@/context/SettingsContext';
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { StyleSheet, Switch, useColorScheme } from 'react-native';
  
export default function TabTwoScreen() { 
  //Importo hooks del context
  const { 
    volume, 
    setVolume, 
    language, 
    setLanguage, 
    voice, 
    setVoice, 
    voiceActive, 
    setVoiceActive 
  } = useSettings();

  
  const colorScheme = useColorScheme();

  const [languagePickerVisible, setLanguagePickerVisible] = useState(false);
  const [speakerPickerVisible, setSpeakerPickerVisible] = useState(false);

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
        <SettingRow label="Lingua"> 
          <PickerModal
            visible={languagePickerVisible}
            onClose={() => setLanguagePickerVisible(false)}
            options={LANGUAGES}
            selectedValue={language}
            onSelect={setLanguage}
            title="Seleziona Lingua"
          />
          <ThemedText onPress={() => setLanguagePickerVisible(true)}>{language}</ThemedText>
        </SettingRow>
          <SettingRow label="Voce"> 
              <PickerModal
                visible={speakerPickerVisible}
                onClose={() => setSpeakerPickerVisible(false)}
                options={SPEAKERS}
                selectedValue={voice}
                onSelect={setVoice}
                title="Seleziona Voce"
              />
          <ThemedText onPress={() => setSpeakerPickerVisible(true)}>{voice}</ThemedText>
        </SettingRow>
        {/* manca la ricerca voe TODO  */}
        <SettingRow label="Volume" slider={true}> 
          <ThemedView  lightColor="transparent" darkColor="transparent">
            <Slider
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#007AFF"
              // maximumTrackTintColor={theme === 'dark' ? '#555' : '#A9A9A9'}
              thumbTintColor="#007AFF"
              value={volume}
              onValueChange={setVolume}
              step={0.01}
            />
          </ThemedView>
        </SettingRow>
      </Card>
      <ThemedText >Versione: 0.0.0</ThemedText>
    </ThemedView>    
  </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    fontSize: 16,
  },
  pickerButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  pickerButtonText: {
    fontSize: 16,
    textAlign: 'center',
  }
});
