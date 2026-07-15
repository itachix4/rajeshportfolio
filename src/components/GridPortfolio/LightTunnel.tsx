"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

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

      const p = reduceMotion ? 0.48 : progress.current;
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.055;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.055;
      const centerX = rect.width * (0.5 + pointer.current.x * 0.025);
      const centerY = rect.height * (0.48 + pointer.current.y * 0.02);
      const lineCount = rect.width < 700 ? 68 : 126;
      const length = Math.hypot(rect.width, rect.height) * (0.75 + p * 0.35);
      const aperture = Math.min(rect.width, rect.height) * (0.014 + p * 0.016);
      const rotation = (reduceMotion ? 0 : now * 0.00003) + p * 0.9;

      for (let index = 0; index < lineCount; index += 1) {
        const seed = index / lineCount;
        const angle = seed * Math.PI * 2 + rotation;
        const variation = 0.76 + ((index * 37) % 31) / 100;
        const innerX = centerX + Math.cos(angle) * aperture * variation;
        const innerY = centerY + Math.sin(angle) * aperture * variation;
        const bend = Math.sin(angle * 3 + p * 8) * 0.12;
        const outerX = centerX + Math.cos(angle + bend) * length * variation;
        const outerY = centerY + Math.sin(angle + bend) * length * variation;
        const gradient = drawingContext.createLinearGradient(innerX, innerY, outerX, outerY);
        const hue = 185 + ((index * 13) % 92);
        gradient.addColorStop(0, `hsla(${hue}, 100%, 72%, ${0.86 - seed * 0.2})`);
        gradient.addColorStop(0.35, `hsla(${hue + 18}, 95%, 59%, ${0.46 + p * 0.28})`);
        gradient.addColorStop(1, `hsla(${hue + 45}, 100%, 54%, 0)`);
        drawingContext.beginPath();
        drawingContext.moveTo(innerX, innerY);
        drawingContext.quadraticCurveTo(
          centerX + Math.cos(angle + bend * 0.2) * length * 0.42,
          centerY + Math.sin(angle - bend * 0.2) * length * 0.42,
          outerX,
          outerY,
        );
        drawingContext.strokeStyle = gradient;
        drawingContext.lineWidth = clamp(0.65 + p * 1.3 + (index % 5) * 0.12, 0.65, 2.4);
        drawingContext.stroke();
      }

      const core = drawingContext.createRadialGradient(centerX, centerY, 0, centerX, centerY, aperture * 5);
      core.addColorStop(0, `rgba(238,252,255,${0.9 - p * 0.2})`);
      core.addColorStop(0.15, "rgba(79,220,255,.55)");
      core.addColorStop(1, "rgba(66,70,255,0)");
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
