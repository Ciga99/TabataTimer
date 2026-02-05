import { Training } from '@/types/Training';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

// Tipi per le fasi del workout
export type WorkoutPhase = 'idle' | 'work' | 'rest' | 'cycle_rest' | 'finished';

// Tipo per lo stato del workout
export type WorkoutState = {
  isWorking: boolean;           // Timer attivo (per la tab bar)
  isPaused: boolean;            // Timer in pausa
  phase: WorkoutPhase;          // Fase corrente
  currentCycle: number;         // Ciclo corrente (1-based)
  currentSerial: number;        // Serie corrente (1-based)
  phaseTimeRemaining: number;   // Secondi rimanenti nella fase corrente
  totalTimeRemaining: number;   // Secondi totali rimanenti
};

type WorkoutContextType = {
  workoutState: WorkoutState;
  startWorkout: (training: Training) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  stopWorkout: () => void;
};

const initialState: WorkoutState = {
  isWorking: false,
  isPaused: false,
  phase: 'idle',
  currentCycle: 0,
  currentSerial: 0,
  phaseTimeRemaining: 0,
  totalTimeRemaining: 0,
};

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Helper: Calcola il tempo totale
const calculateTotalTime = (training: Training): number => {
  return (
    (training.timeWork * training.serial * training.cycles) +
    (training.timePause * (training.serial - 1) * training.cycles) +
    (training.timePauseCycle * (training.cycles - 1))
  );
};

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workoutState, setWorkoutState] = useState<WorkoutState>(initialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);//componente si ri-renderizza a differenza di useState che lo fa in base a certi valori che cambiano valore
  const trainingRef = useRef<Training | null>(null);

  // Helper: Determina la prossima fase
  // Senza useCallback, ogni volta che il componente si ri-renderizza, JavaScript crea una NUOVA funzione tick. Con useCallback, React riutilizza la stessa funzione (a meno che le dipendenze non cambino).
  const getNextPhase = useCallback((
    currentPhase: WorkoutPhase,
    currentSerial: number,
    currentCycle: number,
    training: Training
  ): { phase: WorkoutPhase; serial: number; cycle: number; duration: number } => {
    //  (( Valori di input  ))
    //  { ... valorei di ritorno ... }
      if (currentPhase=== 'work') {
      // Dopo LAVORO: controlla se ci sono altre serie
      if (currentSerial < training.serial) {
        // Vai a RIPOSO tra serie
        return {
          phase: 'rest',
          serial: currentSerial,
          cycle: currentCycle,
          duration: training.timePause
        };
      } else if (currentCycle < training.cycles) {
        // Fine ciclo, vai a PAUSA CICLO
        return {
          phase: 'cycle_rest',
          serial: currentSerial,
          cycle: currentCycle,
          duration: training.timePauseCycle
        };
      } else {
        // Fine allenamento
        return { phase: 'finished', serial: currentSerial, cycle: currentCycle, duration: 0 };
      }
    }

    if (currentPhase === 'rest') {
      // Dopo RIPOSO: vai alla prossima serie di LAVORO
      return {
        phase: 'work',
        serial: currentSerial + 1,
        cycle: currentCycle,
        duration: training.timeWork
      };
    }

    if (currentPhase === 'cycle_rest') {
      // Dopo PAUSA CICLO: inizia nuovo ciclo
      return {
        phase: 'work',
        serial: 1,
        cycle: currentCycle + 1,
        duration: training.timeWork
      };
    }
    // Default (non dovrebbe mai arrivare qui)
    return { phase: 'finished', serial: currentSerial, cycle: currentCycle, duration: 0 };
  }, []);

  // FUNZIONE PRINCIPALE: Tick del timer (chiamata ogni secondo)
  const tick = useCallback(() => {
    setWorkoutState(prev => { //"prev" = stato PRECEDENTE
      if (prev.isPaused || !prev.isWorking) return prev;//Se non fai nulla, ritorna lo stato invariato

      const newPhaseTime = prev.phaseTimeRemaining - 1;
      const newTotalTime = prev.totalTimeRemaining - 1;

      // Fase corrente non terminata
      if (newPhaseTime > 0) {
        return {
          ...prev,
          phaseTimeRemaining: newPhaseTime,
          totalTimeRemaining: newTotalTime,
        };
      }

      // Fase terminata: calcola prossima fase
      const training = trainingRef.current;
      if (!training) return initialState;

      const next = getNextPhase(prev.phase, prev.currentSerial, prev.currentCycle, training);

      if (next.phase === 'finished') {
        // Allenamento completato
        if (intervalRef.current) clearInterval(intervalRef.current);
        return {
          ...initialState,
          phase: 'finished',
          currentCycle: prev.currentCycle,
          currentSerial: prev.currentSerial,
        };
      }

      return {
        ...prev,
        phase: next.phase,
        currentSerial: next.serial,
        currentCycle: next.cycle,
        phaseTimeRemaining: next.duration,
        totalTimeRemaining: newTotalTime,
      };
    });
  }, [getNextPhase]);

  // START
  const startWorkout = useCallback((training: Training) => {
    trainingRef.current = training;
    const totalTime = calculateTotalTime(training);
    setWorkoutState({
      isWorking: true,
      isPaused: false,
      phase: 'work',
      currentCycle: 1,
      currentSerial: 1,
      phaseTimeRemaining: training.timeWork,
      totalTimeRemaining: totalTime,
    });

    // Avvia interval
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  // PAUSE
  const pauseWorkout = useCallback(() => {
    setWorkoutState(prev => ({ ...prev, isPaused: true }));
  }, []);

  // RESUME
  const resumeWorkout = useCallback(() => {
    setWorkoutState(prev => ({ ...prev, isPaused: false }));
  }, []);

  // STOP
  const stopWorkout = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    trainingRef.current = null;
    setWorkoutState(initialState);
  }, []);

  // Cleanup quando componente smonta
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <WorkoutContext.Provider value={{ workoutState, startWorkout, pauseWorkout, resumeWorkout, stopWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout deve essere usato dentro WorkoutProvider');
  }
  return context;
};
