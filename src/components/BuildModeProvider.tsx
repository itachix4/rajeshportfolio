import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import {
  BUILD_MODES,
  BuildMode,
  BuildModeContext,
  BuildModeContextValue,
} from "./buildMode";

export const BuildModeProvider = ({ children }: PropsWithChildren) => {
  const [mode, setMode] = useState<BuildMode>("designer");

  useEffect(() => {
    document.documentElement.dataset.buildMode = mode;
  }, [mode]);

  const value = useMemo<BuildModeContextValue>(
    () => ({
      mode,
      setMode,
      cycleMode: () => {
        const currentIndex = BUILD_MODES.findIndex((item) => item.id === mode);
        setMode(BUILD_MODES[(currentIndex + 1) % BUILD_MODES.length].id);
      },
    }),
    [mode]
  );

  return <BuildModeContext.Provider value={value}>{children}</BuildModeContext.Provider>;
};
