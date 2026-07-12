import { useEffect, useState } from "react";

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

const canCreateWebGLContext = (requireWebGL2: boolean) => {
  try {
    const canvas = document.createElement("canvas");
    const options = { failIfMajorPerformanceCaveat: true };
    const context = (
      canvas.getContext("webgl2", options) ??
      (requireWebGL2 ? null : canvas.getContext("webgl", options))
    ) as WebGLRenderingContext | WebGL2RenderingContext | null;

    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(context);
  } catch {
    return false;
  }
};

/**
 * Keeps the expensive renderer off coarse-pointer and constrained devices.
 * The static DOM artwork remains the default, so SSR and failed GPU contexts
 * never leave an empty hero behind.
 */
const useAdaptiveWebGL = ({ requireWebGL2 = false } = {}) => {
  const [allowWebGL, setAllowWebGL] = useState(false);

  useEffect(() => {
    const navigatorHints = navigator as NavigatorWithHints;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const narrowViewport = window.innerWidth < 820;
    const constrainedMemory = (navigatorHints.deviceMemory ?? 8) <= 4;
    const constrainedCPU = (navigator.hardwareConcurrency ?? 8) <= 4;
    const dataSaver = Boolean(navigatorHints.connection?.saveData);

    const lowPowerDevice =
      coarsePointer || narrowViewport || constrainedMemory || constrainedCPU || dataSaver;

    setAllowWebGL(!lowPowerDevice && canCreateWebGLContext(requireWebGL2));
  }, [requireWebGL2]);

  return allowWebGL;
};

export default useAdaptiveWebGL;
