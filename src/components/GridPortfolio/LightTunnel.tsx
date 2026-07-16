"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const LINE_COUNT = 126;

type LineConstant = { seed: number; variation: number; hue: number; ember: boolean; width: number };

const LINES: LineConstant[] = Array.from({ length: LINE_COUNT }, (_, index) => ({
  seed: index / LINE_COUNT,
  variation: 0.76 + ((index * 37) % 31) / 100,
  hue: 213 + ((index * 13) % 50),
  ember: index % 16 === 0,
  width: (index % 5) * 0.12,
}));

const LightTunnel = ({ progress }: { progress: React.MutableRefObject<number> }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visible = useRef(true);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const frame = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const node = canvas;
    const drawingContext = context;
    let lastProgress = -1;
    let parity = 0;

    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (entry.isIntersecting && frame.current === null) frame.current = requestAnimationFrame(draw);
    });
    observer.observe(node);

    const handlePointer = (event: PointerEvent) => {
      pointer.current.tx = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      pointer.current.ty = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });

    function draw(now = 0) {
      frame.current = null;

      const p = reduceMotion ? 0.48 : progress.current;
      const pointerSettled =
        Math.abs(pointer.current.tx - pointer.current.x) < 0.004 && Math.abs(pointer.current.ty - pointer.current.y) < 0.004;
      const idle = Math.abs(p - lastProgress) < 0.0005 && pointerSettled;
      parity = (parity + 1) % 2;
      if (idle && parity === 1) {
        /* Half-rate while nothing is moving; the ambient rotation is slow enough not to stutter. */
        if (visible.current && !reduceMotion) frame.current = requestAnimationFrame(draw);
        return;
      }
      lastProgress = p;

      const rect = node.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.4);
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (node.width !== width || node.height !== height) {
        node.width = width;
        node.height = height;
      }
      drawingContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawingContext.clearRect(0, 0, rect.width, rect.height);

      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.055;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.055;
      const centerX = rect.width * (0.5 + pointer.current.x * 0.025);
      const centerY = rect.height * (0.48 + pointer.current.y * 0.02);
      const compact = rect.width < 700;
      const length = Math.hypot(rect.width, rect.height) * (0.75 + p * 0.35);
      const aperture = Math.min(rect.width, rect.height) * (0.014 + p * 0.016);
      const rotation = (reduceMotion ? 0 : now * 0.00003) + p * 0.9;

      for (let index = 0; index < LINE_COUNT; index += 1) {
        if (compact && index % 2 === 1) continue;
        const line = LINES[index];
        const angle = line.seed * Math.PI * 2 + rotation;
        const innerX = centerX + Math.cos(angle) * aperture * line.variation;
        const innerY = centerY + Math.sin(angle) * aperture * line.variation;
        const bend = Math.sin(angle * 3 + p * 8) * 0.12;
        const outerX = centerX + Math.cos(angle + bend) * length * line.variation;
        const outerY = centerY + Math.sin(angle + bend) * length * line.variation;
        const gradient = drawingContext.createLinearGradient(innerX, innerY, outerX, outerY);
        if (line.ember) {
          gradient.addColorStop(0, `hsla(26, 100%, 74%, ${0.9 - line.seed * 0.2})`);
          gradient.addColorStop(0.35, `hsla(22, 96%, 58%, ${0.4 + p * 0.26})`);
          gradient.addColorStop(1, "hsla(18, 100%, 50%, 0)");
        } else {
          gradient.addColorStop(0, `hsla(${line.hue}, 100%, 76%, ${0.86 - line.seed * 0.2})`);
          gradient.addColorStop(0.35, `hsla(${line.hue + 10}, 92%, 60%, ${0.46 + p * 0.28})`);
          gradient.addColorStop(1, `hsla(${line.hue + 18}, 96%, 54%, 0)`);
        }
        drawingContext.beginPath();
        drawingContext.moveTo(innerX, innerY);
        drawingContext.quadraticCurveTo(
          centerX + Math.cos(angle + bend * 0.2) * length * 0.42,
          centerY + Math.sin(angle - bend * 0.2) * length * 0.42,
          outerX,
          outerY,
        );
        drawingContext.strokeStyle = gradient;
        drawingContext.lineWidth = clamp(0.65 + p * 1.3 + line.width, 0.65, 2.4);
        drawingContext.stroke();
      }

      const core = drawingContext.createRadialGradient(centerX, centerY, 0, centerX, centerY, aperture * 5);
      core.addColorStop(0, `rgba(241,236,223,${0.9 - p * 0.2})`);
      core.addColorStop(0.15, "rgba(110,146,255,.55)");
      core.addColorStop(1, "rgba(23,63,231,0)");
      drawingContext.fillStyle = core;
      drawingContext.fillRect(centerX - aperture * 5, centerY - aperture * 5, aperture * 10, aperture * 10);

      if (visible.current && !reduceMotion) frame.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointer);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [progress, reduceMotion]);

  return <canvas ref={canvasRef} className="motionfolio-tunnel" aria-hidden="true" />;
};

export default LightTunnel;
