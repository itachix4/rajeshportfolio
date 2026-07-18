"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const smooth = (edgeA: number, edgeB: number, value: number) => {
  const t = clamp((value - edgeA) / Math.max(edgeB - edgeA, 0.0001));
  return t * t * (3 - 2 * t);
};

/* Camera-space warp tunnel. Every element lives at a depth z in (NEAR..1]:
   stars fly toward the camera leaving additive streaks, perspective rings
   slide past on a slowly curving flight path, and a destination-out fade
   keeps a phosphor trail of previous frames. Scroll progress steers phase
   colour; scroll velocity feeds the warp speed. */

const STAR_COUNT = 230;
const RING_COUNT = 10;
const NEAR = 0.06;
const GOLDEN_ANGLE = 2.399963;

type Star = { seed: number; angle: number; z: number; pace: number; warmBias: number; girth: number };

const STARS: Star[] = Array.from({ length: STAR_COUNT }, (_, index) => ({
  seed: index / STAR_COUNT,
  angle: (index * GOLDEN_ANGLE) % (Math.PI * 2),
  z: NEAR + (((index * 61) % 97) / 97) * (1 - NEAR),
  pace: 0.55 + (((index * 29) % 53) / 53) * 0.95,
  warmBias: ((index * 43) % 101) / 101,
  girth: 0.7 + (((index * 17) % 7) / 7) * 1.5,
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
    const paint = context;
    const stars = STARS.map((star) => ({ ...star }));
    let lastProgress = -1;
    let lastNow = 0;
    let boost = 0;
    let ringShift = 0;

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
      const dtn = lastNow === 0 ? 1 : clamp((now - lastNow) / 16.7, 0.25, 3);
      lastNow = now;

      const p = reduceMotion ? 0.48 : progress.current;
      if (lastProgress === -1) lastProgress = p;
      boost += (clamp(Math.abs(p - lastProgress) * 260, 0, 2.2) - boost) * 0.09;
      lastProgress = p;

      const rect = node.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.4);
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (node.width !== width || node.height !== height) {
        node.width = width;
        node.height = height;
      }
      paint.setTransform(ratio, 0, 0, ratio, 0, 0);

      if (reduceMotion) {
        paint.clearRect(0, 0, rect.width, rect.height);
      } else {
        /* Phosphor persistence: dim what is already there instead of clearing. */
        paint.globalCompositeOperation = "destination-out";
        paint.fillStyle = `rgba(0, 0, 0, ${clamp(0.3 * dtn, 0.12, 0.62)})`;
        paint.fillRect(0, 0, rect.width, rect.height);
      }
      paint.globalCompositeOperation = "lighter";

      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.055;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.055;
      const centerX = rect.width * (0.5 + pointer.current.x * 0.03);
      const centerY = rect.height * (0.48 + pointer.current.y * 0.025);
      const minDim = Math.min(rect.width, rect.height);
      const compact = rect.width < 700;
      const scale = minDim * 0.062;
      const speed = (0.0034 + p * 0.0078 + boost * 0.0095) * dtn;
      const warmMix = smooth(0.24, 0.42, p) * (1 - 0.55 * smooth(0.68, 0.86, p));
      const bendPhase = now * 0.00016 + p * 2.6;

      const centerAt = (z: number): [number, number] => {
        const off = (1 - z) * (1 - z);
        return [
          centerX + Math.sin(bendPhase) * off * rect.width * 0.07,
          centerY + Math.cos(bendPhase * 0.83) * off * rect.height * 0.05,
        ];
      };

      /* Tunnel rings sliding past the camera. */
      ringShift = (ringShift + speed * 0.55) % 1;
      const rings = compact ? RING_COUNT - 4 : RING_COUNT;
      for (let index = 0; index < rings; index += 1) {
        const cycle = (index / rings + ringShift) % 1;
        const z = NEAR + (1 - cycle) * (1 - NEAR);
        const f = 1 / z - 1;
        const radius = f * scale;
        if (radius < 2 || radius > minDim * 1.6) continue;
        const [ringX, ringY] = centerAt(z);
        const presence = Math.sin(cycle * Math.PI);
        const warmRing = warmMix > 0.28 && index % 3 === 0;
        paint.beginPath();
        paint.ellipse(ringX, ringY, radius, radius * 0.86, 0, 0, Math.PI * 2);
        paint.strokeStyle = warmRing
          ? `hsla(24, 96%, 60%, ${presence * (0.05 + p * 0.1)})`
          : `hsla(${222 + index * 4}, 92%, 64%, ${presence * (0.06 + p * 0.12)})`;
        paint.lineWidth = clamp(f * 0.55, 0.5, 3.2);
        paint.stroke();
      }

      /* Warp stars with depth-projected streaks. */
      for (let index = 0; index < STAR_COUNT; index += 1) {
        if (compact && index % 2 === 1) continue;
        const star = stars[index];
        star.z -= speed * star.pace;
        if (star.z <= NEAR) {
          star.z += 1 - NEAR;
          star.angle = (star.angle + GOLDEN_ANGLE) % (Math.PI * 2);
        }
        const f = 1 / star.z - 1;
        const tail = 1 / Math.min(star.z + speed * star.pace * 4.5 + 0.012, 1) - 1;
        const [nearX, nearY] = centerAt(star.z);
        const cosA = Math.cos(star.angle);
        const sinA = Math.sin(star.angle) * 0.86;
        const x = nearX + cosA * f * scale;
        const y = nearY + sinA * f * scale;
        const tx = nearX + cosA * tail * scale;
        const ty = nearY + sinA * tail * scale;
        const closeness = clamp((1 - star.z) * 1.12);
        const alpha = closeness * closeness * (0.3 + p * 0.42);
        const warm = star.warmBias < 0.12 + warmMix * 0.52;
        paint.beginPath();
        paint.moveTo(tx, ty);
        paint.lineTo(x, y);
        paint.strokeStyle = warm
          ? `hsla(${20 + star.seed * 12}, 100%, ${58 + closeness * 16}%, ${alpha})`
          : `hsla(${210 + star.seed * 44}, 96%, ${62 + closeness * 16}%, ${alpha})`;
        paint.lineWidth = star.girth * clamp(f * 0.16, 0.4, 2.7);
        paint.stroke();
      }

      /* Singularity core with a warm counter-halo. */
      const coreRadius = scale * (2.6 + p * 1.6);
      const core = paint.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius);
      core.addColorStop(0, `rgba(241, 236, 223, ${0.8 - p * 0.18})`);
      core.addColorStop(0.16, "rgba(122, 156, 255, 0.5)");
      core.addColorStop(0.5, "rgba(34, 74, 235, 0.16)");
      core.addColorStop(1, "rgba(23, 63, 231, 0)");
      paint.fillStyle = core;
      paint.fillRect(centerX - coreRadius, centerY - coreRadius, coreRadius * 2, coreRadius * 2);
      if (warmMix > 0.05) {
        const halo = paint.createRadialGradient(centerX, centerY, coreRadius * 0.2, centerX, centerY, coreRadius * 2.2);
        halo.addColorStop(0, `rgba(255, 132, 40, ${0.16 * warmMix})`);
        halo.addColorStop(1, "rgba(255, 106, 0, 0)");
        paint.fillStyle = halo;
        paint.fillRect(centerX - coreRadius * 2.2, centerY - coreRadius * 2.2, coreRadius * 4.4, coreRadius * 4.4);
      }
      paint.globalCompositeOperation = "source-over";

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
