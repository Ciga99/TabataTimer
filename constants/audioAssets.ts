import { Languages } from '@/context/SettingsContext';

export type AudioEvent = 'start' | 'end' | 'pause' | 'resume' | 'reset' | 'work' | 'rest' | 'cycle_rest';
export type AudioSpeaker = 'Donna' | 'Uomo';

// Countdown sound (indipendente da lingua/speaker)
export const COUNTDOWN_SOUND = require('@/assets/sounds/3_second_CountDown.mp3');

// Mappa statica: AUDIO_MAP[lingua][evento][speaker]
// React Native richiede require() statici - non si possono costruire path dinamicamente
export const AUDIO_MAP: Record<Languages, Record<AudioEvent, Record<AudioSpeaker, any>>> = {
  ITA: {
    start:      { Donna: require('@/assets/sounds/ITA/start/Donna.mp3'),      Uomo: require('@/assets/sounds/ITA/start/Uomo.mp3') },
    end:        { Donna: require('@/assets/sounds/ITA/end/Donna.mp3'),        Uomo: require('@/assets/sounds/ITA/end/Uomo.mp3') },
    pause:      { Donna: require('@/assets/sounds/ITA/pause/Donna.mp3'),      Uomo: require('@/assets/sounds/ITA/pause/Uomo.mp3') },
    resume:     { Donna: require('@/assets/sounds/ITA/resume/Donna.mp3'),     Uomo: require('@/assets/sounds/ITA/resume/Uomo.mp3') },
    reset:      { Donna: require('@/assets/sounds/ITA/reset/Donna.mp3'),      Uomo: require('@/assets/sounds/ITA/reset/Uomo.mp3') },
    work:       { Donna: require('@/assets/sounds/ITA/work/Donna.mp3'),       Uomo: require('@/assets/sounds/ITA/work/Uomo.mp3') },
    rest:       { Donna: require('@/assets/sounds/ITA/rest/Donna.mp3'),       Uomo: require('@/assets/sounds/ITA/rest/Uomo.mp3') },
    cycle_rest: { Donna: require('@/assets/sounds/ITA/cycle_rest/Donna.mp3'), Uomo: require('@/assets/sounds/ITA/cycle_rest/Uomo.mp3') },
  },
  ENG: {
    start:      { Donna: require('@/assets/sounds/ENG/start/Donna.mp3'),      Uomo: require('@/assets/sounds/ENG/start/Uomo.mp3') },
    end:        { Donna: require('@/assets/sounds/ENG/end/Donna.mp3'),        Uomo: require('@/assets/sounds/ENG/end/Uomo.mp3') },
    pause:      { Donna: require('@/assets/sounds/ENG/pause/Donna.mp3'),      Uomo: require('@/assets/sounds/ENG/pause/Uomo.mp3') },
    resume:     { Donna: require('@/assets/sounds/ENG/resume/Donna.mp3'),     Uomo: require('@/assets/sounds/ENG/resume/Uomo.mp3') },
    reset:      { Donna: require('@/assets/sounds/ENG/reset/Donna.mp3'),      Uomo: require('@/assets/sounds/ENG/reset/Uomo.mp3') },
    work:       { Donna: require('@/assets/sounds/ENG/work/Donna.mp3'),       Uomo: require('@/assets/sounds/ENG/work/Uomo.mp3') },
    rest:       { Donna: require('@/assets/sounds/ENG/rest/Donna.mp3'),       Uomo: require('@/assets/sounds/ENG/rest/Uomo.mp3') },
    cycle_rest: { Donna: require('@/assets/sounds/ENG/cycle_rest/Donna.mp3'), Uomo: require('@/assets/sounds/ENG/cycle_rest/Uomo.mp3') },
  },
};
