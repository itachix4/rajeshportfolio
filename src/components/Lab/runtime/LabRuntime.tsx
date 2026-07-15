import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

export type LabClues = {
  motionSignature: boolean;
  archiveSymbol: boolean;
  capabilityPhrase: boolean;
  forgeCommand: boolean;
  coreUnlocked: boolean;
};

export type LabSound =
  | "motion"
  | "fabricate"
  | "shader"
  | "system"
  | "command"
  | "deploy"
  | "archive"
  | "map"
  | "core";

type LabRuntimeValue = {
  clues: LabClues;
  revealClue: (clue: keyof Omit<LabClues, "coreUnlocked">) => void;
  unlockCore: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  playSound: (sound: LabSound) => void;
};

const DEFAULT_CLUES: LabClues = {
  motionSignature: false,
  archiveSymbol: false,
  capabilityPhrase: false,
  forgeCommand: false,
  coreUnlocked: false,
};

const CLUE_STORAGE_KEY = "parth-lab-core-clues-v1";
const LabRuntimeContext = createContext<LabRuntimeValue | null>(null);

const SOUND_PROFILES: Record<LabSound, { frequency: number; endFrequency: number; duration: number; type: OscillatorType }> = {
  motion: { frequency: 330, endFrequency: 520, duration: 0.08, type: "sine" },
  fabricate: { frequency: 420, endFrequency: 840, duration: 0.12, type: "triangle" },
  shader: { frequency: 110, endFrequency: 176, duration: 0.16, type: "sawtooth" },
  system: { frequency: 620, endFrequency: 580, duration: 0.07, type: "square" },
  command: { frequency: 220, endFrequency: 260, duration: 0.05, type: "square" },
  deploy: { frequency: 180, endFrequency: 720, duration: 0.18, type: "sawtooth" },
  archive: { frequency: 260, endFrequency: 220, duration: 0.11, type: "triangle" },
  map: { frequency: 480, endFrequency: 620, duration: 0.09, type: "sine" },
  core: { frequency: 72, endFrequency: 288, duration: 0.34, type: "sine" },
};

export const LabRuntimeProvider = ({ children }: PropsWithChildren) => {
  const [clues, setClues] = useState(DEFAULT_CLUES);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CLUE_STORAGE_KEY);
      if (stored) setClues({ ...DEFAULT_CLUES, ...(JSON.parse(stored) as Partial<LabClues>) });
    } catch {
      // The unlock still works in-memory when persistent storage is unavailable.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(CLUE_STORAGE_KEY, JSON.stringify(clues));
    } catch {
      // Persistence is progressive enhancement.
    }
  }, [clues]);

  useEffect(() => () => {
    void audioContext.current?.close();
  }, []);

  const revealClue = useCallback((clue: keyof Omit<LabClues, "coreUnlocked">) => {
    setClues((current) => (current[clue] ? current : { ...current, [clue]: true }));
  }, []);

  const unlockCore = useCallback(() => {
    setClues((current) => ({ ...current, forgeCommand: true, coreUnlocked: true }));
  }, []);

  const playSound = useCallback((sound: LabSound) => {
    if (!soundEnabled) return;
    const AudioContextConstructor = window.AudioContext
      ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;

    const context = audioContext.current ?? new AudioContextConstructor();
    audioContext.current = context;
    if (context.state === "suspended") void context.resume();

    const profile = SOUND_PROFILES[sound];
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = profile.type;
    oscillator.frequency.setValueAtTime(profile.frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(profile.endFrequency, now + profile.duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.035, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + profile.duration + 0.02);
  }, [soundEnabled]);

  const value = useMemo<LabRuntimeValue>(() => ({
    clues,
    revealClue,
    unlockCore,
    soundEnabled,
    toggleSound: () => setSoundEnabled((enabled) => !enabled),
    playSound,
  }), [clues, playSound, revealClue, soundEnabled, unlockCore]);

  return <LabRuntimeContext.Provider value={value}>{children}</LabRuntimeContext.Provider>;
};

export const useLabRuntime = () => {
  const runtime = useContext(LabRuntimeContext);
  if (!runtime) throw new Error("useLabRuntime must be used inside LabRuntimeProvider");
  return runtime;
};

export const useLabStoredState = <T,>(key: string, initialValue: T) => {
  const storageKey = `parth-lab-app:${key}`;
  const [value, setValue] = useState<T>(initialValue);
  const hydrated = useRef(false);
  const skipInitialPersist = useRef(true);

  useEffect(() => {
    hydrated.current = false;
    skipInitialPersist.current = true;
    try {
      const stored = window.sessionStorage.getItem(storageKey);
      if (stored) setValue(JSON.parse(stored) as T);
    } catch {
      // Keep the in-memory default.
    } finally {
      hydrated.current = true;
    }
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated.current) return;
    if (skipInitialPersist.current) {
      skipInitialPersist.current = false;
      return;
    }
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // State persistence is optional.
    }
  }, [storageKey, value]);

  const update = useCallback((next: SetStateAction<T>) => {
    setValue(next);
  }, []);

  return [value, update] as const;
};
