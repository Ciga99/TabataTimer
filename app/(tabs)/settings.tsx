import { Card } from '@/components/Card';
import { PickerModal } from '@/components/modalSpeker';
import { SettingRow } from '@/components/SettingRow';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LANGUAGES, useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/context/ThemeContext';
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';

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


  // Tema
  const { isDarkMode, setThemeMode } = useTheme();

  const [languagePickerVisible, setLanguagePickerVisible] = useState(false);
  const [speakerPickerVisible, setSpeakerPickerVisible] = useState(false);

  //Sono come le variabili di stato di un compinente Angualr  
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedView>
          {/* Sezione Aspetto */}
          <Card title="Aspetto">
            <SettingRow label="Modalità Scura">
              <Switch
                trackColor={{ false: '#767577', true: 'green' }}
                onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
                value={isDarkMode}
              />
            </SettingRow>
          </Card>

          {/* Sezione Suoni */}
          <Card title="Suoni">
            <SettingRow label="Voci Abilitate">
              <Switch
                trackColor={{ false: '#767577', true: 'green' }}
                value={voiceActive}
                onValueChange={setVoiceActive}
              />
            </SettingRow>
            {voiceActive && (
              // blocco di codice condizionale deve avere sempre un solo "padre". <> ... </>. È come un contenitore invisibile che non sporca il layout.
              <>
                <SettingRow label="Lingua">
                  <TouchableOpacity
                    onPress={() => setLanguagePickerVisible(true)}
                    style={[styles.pickerButton, { borderColor: '#ffffff', borderWidth: 1 }]}>
                    <ThemedText style={styles.pickerButtonText}>{language}</ThemedText>
                  </TouchableOpacity>
                  <PickerModal
                    visible={languagePickerVisible}
                    onClose={() => setLanguagePickerVisible(false)}
                    options={LANGUAGES}
                    selectedValue={language}
                    onSelect={setLanguage}
                    title="Seleziona Lingua"
                  />
                </SettingRow>
                <SettingRow label="Volume" slider={true}>
                  <ThemedView lightColor="transparent" darkColor="transparent">
                    <Slider
                      style={{ marginTop: 20 }}
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
              </>
            )}
          </Card>
          <ThemedText >Versione: 0.0.0</ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 120, // Spazio per tab bar (70px) + margine (30px) + extra (20px)
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
