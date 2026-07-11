import { createContext, useContext } from "react";

export type BuildMode = "designer" | "engineer" | "founder";

export const BUILD_MODES: Array<{
  id: BuildMode;
  label: string;
  shortLabel: string;
}> = [
  { id: "designer", label: "Designer", shortLabel: "D" },
  { id: "engineer", label: "Engineer", shortLabel: "E" },
  { id: "founder", label: "Founder", shortLabel: "F" },
];

export type BuildModeContextValue = {
  mode: BuildMode;
  setMode: (mode: BuildMode) => void;
  cycleMode: () => void;
};

export const BuildModeContext = createContext<BuildModeContextValue | null>(null);

export const useBuildMode = () => {
  const context = useContext(BuildModeContext);
  if (!context) {
    throw new Error("useBuildMode must be used inside BuildModeProvider");
  }
  return context;
};
