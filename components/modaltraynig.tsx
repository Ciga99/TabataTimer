import { useSettings } from "@/context/SettingsContext";
import { useState } from "react";
import { Modal } from "react-native";
import { ThemedText } from "./themed-text";

type TrainingModalProps<T> = {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: T) => void;
};

//   const { theme } = useTheme();
//   const { width } = useWindowDimensions();
//   const [title, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [cycles, setCycles] = useState(1);
//   const [serial, setSerial] = useState(8);
//   const [timeWork, setTimeWork] = useState(30);
//   const [timePause, setTimePause] = useState(30);
//   const [timePauseCycle, setTimePauseCycle] = useState(30);
//   const [voice, setVoice] = useState<VoiceOption>('Filippo');
//   const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
//   const [voicePickerVisible, setVoicePickerVisible] = useState(false);

export function trainingModal<T>(props: TrainingModalProps<T>) {
    const [speakerPickerVisible, setSpeakerPickerVisible] = useState(false);
    const { visible, onClose, onSelect } = props;
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
    
      
    return (
        <Modal transparent={true} visible={visible} animationType="fade">
          <ThemedText>Titolo:  </ThemedText>
          <ThemedText>Descrizione: </ThemedText>
          <ThemedText>Numero di serie : </ThemedText>
          <ThemedText>Numero di cicli  : </ThemedText>
          <ThemedText>Tempo per serie : </ThemedText>
          <ThemedText>Tempo per pausa  : </ThemedText>
          <ThemedText>Tempo per pausa ciclo : </ThemedText>
          <ThemedText>Tempo totale di allenamento</ThemedText>
          <ThemedText>Voce attiva : {voiceActive ? "Sì" : "No"}</ThemedText>
          <ThemedText>Voce : </ThemedText>                 
        </Modal>       
    );
}