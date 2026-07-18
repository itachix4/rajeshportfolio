"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import useAdaptiveWebGL from "../useAdaptiveWebGL";
import RenderBoundary from "../RenderBoundary";

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2 uPointer;
  uniform float uIntensity;
  uniform float uTime;
  uniform float uPlaneAspect;
  uniform float uImageAspect;
  varying vec2 vUv;

  void main() {
    /* Cover fit, anchored to the top like the DOM image it replaces. */
    vec2 scale = uPlaneAspect > uImageAspect
      ? vec2(1.0, uImageAspect / uPlaneAspect)
      : vec2(uPlaneAspect / uImageAspect, 1.0);
    vec2 uv = vec2(vUv.x * scale.x + (1.0 - scale.x) * 0.5, vUv.y * scale.y + (1.0 - scale.y));

    vec2 toPointer = vUv - uPointer;
    float dist = length(toPointer * vec2(uPlaneAspect, 1.0));
    float ripple = exp(-dist * 7.5) * uIntensity;
    vec2 direction = normalize(toPointer + vec2(0.0001));
    vec2 duv = uv - direction * ripple * 0.055;
    duv += vec2(sin(vUv.y * 21.0 + uTime * 2.3), sin(vUv.x * 17.0 + uTime * 2.0)) * ripple * 0.011;

    float shift = ripple * 0.014;
    float r = texture2D(uTexture, duv + direction * shift).r;
    float g = texture2D(uTexture, duv).g;
    float b = texture2D(uTexture, duv - direction * shift).b;
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

const DistortionPlane = ({ src, hostRef }: { src: string; hostRef: React.RefObject<HTMLElement | null> }) => {
  const { viewport } = useThree();
  const material = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef(new THREE.Vector2(0.5, 0.5));
  const energy = useRef(0);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let disposed = false;
    loader.load(src, (loaded) => {
      if (disposed) {
        loaded.dispose();
        return;
      }
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.minFilter = THREE.LinearFilter;
      setTexture(loaded);
    });
    return () => {
      disposed = true;
    };
  }, [src]);

  useEffect(() => () => texture?.dispose(), [texture]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      pointer.current.set(
        (event.clientX - rect.left) / Math.max(rect.width, 1),
        1 - (event.clientY - rect.top) / Math.max(rect.height, 1),
      );
      energy.current = 1;
    };
    const onLeave = () => {
      energy.current = 0;
    };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [hostRef]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: null as THREE.Texture | null },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uIntensity: { value: 0 },
      uTime: { value: 0 },
      uPlaneAspect: { value: 1 },
      uImageAspect: { value: 1 },
    }),
    [],
  );

  useFrame(({ clock }, delta) => {
    const shader = material.current;
    if (!shader || !texture) return;
    shader.uniforms.uTexture.value = texture;
    shader.uniforms.uTime.value = clock.getElapsedTime();
    shader.uniforms.uPlaneAspect.value = viewport.width / Math.max(viewport.height, 0.0001);
    shader.uniforms.uImageAspect.value = texture.image.width / Math.max(texture.image.height, 1);
    const current = shader.uniforms.uIntensity.value as number;
    shader.uniforms.uIntensity.value = THREE.MathUtils.damp(current, energy.current, 5.5, delta);
    (shader.uniforms.uPointer.value as THREE.Vector2).lerp(pointer.current, Math.min(delta * 9, 1));
  });

  if (!texture) return null;
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry />
      <shaderMaterial ref={material} vertexShader={VERTEX} fragmentShader={FRAGMENT} uniforms={uniforms} />
    </mesh>
  );
};

/* Liquid hover distortion layered over the DOM image. The plain <Image>
   stays underneath as poster and fallback, so losing WebGL costs nothing. */
const DistortionMedia = ({ src }: { src: string }) => {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const hostRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const allowWebGL = useAdaptiveWebGL();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    hostRef.current = wrap.closest("[data-liquid-host]") ?? wrap.closest("button");
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "18%" });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={wrapRef} className="mf-distort" aria-hidden="true">
      {allowWebGL && !reduceMotion && (
        <RenderBoundary fallback={null}>
          <Canvas
            dpr={[1, 1.6]}
            frameloop={visible ? "always" : "never"}
            gl={{ antialias: false, alpha: true, powerPreference: "default" }}
          >
            <DistortionPlane src={src} hostRef={hostRef} />
          </Canvas>
        </RenderBoundary>
      )}
    </span>
  );
};

export default DistortionMedia;
