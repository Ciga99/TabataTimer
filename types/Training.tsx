import { Speakers } from "@/context/SettingsContext";

export type Training = {
    title: string;
    description: string;
    cycles: number;
    serial: number;
    timeWork: number;
    timePause: number;
    timePauseCycle: number;
    timeTotal: number;
    voice: Speakers;
    isVoiceEnabled: boolean;
}