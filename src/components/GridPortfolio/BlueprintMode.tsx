"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
const WORD = ["f", "o", "r", "g", "e"];

const matchesTail = (buffer: string[], sequence: string[]) =>
  sequence.length <= buffer.length && sequence.every((key, index) => buffer[buffer.length - sequence.length + index] === key);

/* Easter egg: the Konami code — or simply typing "forge" — exposes the
   site's own construction. CSS under html.mf-blueprint does the drawing;
   this component only tracks the key sequence and renders the HUD chip. */
const BlueprintMode = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const buffer: string[] = [];
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (event.key === "Escape") {
        setActive(false);
        return;
      }
      buffer.push(event.key.toLowerCase());
      if (buffer.length > KONAMI.length) buffer.shift();
      if (matchesTail(buffer, KONAMI) || matchesTail(buffer, WORD)) {
        buffer.length = 0;
        setActive((current) => !current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("mf-blueprint", active);
    return () => document.documentElement.classList.remove("mf-blueprint");
  }, [active]);

  if (!active) return null;
  return (
    <div className="mf-blueprint-hud" role="status">
      <span>Blueprint mode</span>
      <p>Structure exposed. Type “forge” or press Esc to close.</p>
      <button type="button" onClick={() => setActive(false)} aria-label="Close blueprint mode">
        <X size={15} />
      </button>
    </div>
  );
};

export default BlueprintMode;
