import { useEffect, useState } from "react";

/**
 * Iteratively builds `text` slice by slice.
 * `enabled` defers the start until the site loader has finished revealing.
 */
const useTypewriter = (
  text: string,
  speed = 38,
  startDelay = 600,
  enabled = true
) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let index = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
      setDisplayed("");
      setDone(false);
    };
  }, [text, speed, startDelay, enabled]);

  return { displayed, done };
};

export default useTypewriter;
