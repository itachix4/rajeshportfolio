"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type PointerTarget = { x: number; y: number };

const createLoop = (x: number) =>
  new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(x, 1.55, 0),
      new THREE.Vector3(x + 1.08, 1.6, 0.15),
      new THREE.Vector3(x + 1.34, 0.86, 0.36),
      new THREE.Vector3(x + 1.02, 0.18, 0.2),
      new THREE.Vector3(x, 0.28, 0),
    ],
    false,
    "catmullrom",
    0.46,
  );

const MarkGeometry = ({ pointer }: { pointer: React.MutableRefObject<PointerTarget> }) => {
  const group = useRef<THREE.Group>(null);
  const leftStem = useMemo(
    () => new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(-1.45, -1.55, 0), new THREE.Vector3(-1.45, 1.55, 0)), 48, 0.18, 16, false),
    [],
  );
  const rightStem = useMemo(
    () => new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0.05, -1.55, 0), new THREE.Vector3(0.05, 1.55, 0)), 48, 0.18, 16, false),
    [],
  );
  const leftLoop = useMemo(() => new THREE.TubeGeometry(createLoop(-1.45), 72, 0.18, 16, false), []);
  const rightLoop = useMemo(() => new THREE.TubeGeometry(createLoop(0.05), 72, 0.18, 16, false), []);

  useEffect(
    () => () => {
      leftStem.dispose();
      rightStem.dispose();
      leftLoop.dispose();
      rightLoop.dispose();
    },
    [leftLoop, leftStem, rightLoop, rightStem],
  );

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const time = clock.getElapsedTime();
    const targetX = pointer.current.y * -0.24 + Math.sin(time * 0.45) * 0.035;
    const targetY = pointer.current.x * 0.34 + Math.cos(time * 0.38) * 0.055;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4.2, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4.2, delta);
    group.current.rotation.z = Math.sin(time * 0.28) * 0.025;
  });

  return (
    <group ref={group} rotation={[0.12, -0.2, -0.04]}>
      {[leftStem, rightStem, leftLoop, rightLoop].map((geometry, index) => (
        <mesh key={index} geometry={geometry} castShadow>
          <meshPhysicalMaterial
            color={index % 2 ? "#315cff" : "#2148ed"}
            metalness={0.58}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.08}
            envMapIntensity={1.8}
          />
        </mesh>
      ))}
    </group>
  );
};

const StaticMark = () => (
  <div className="motionfolio-mark-fallback" aria-hidden="true">
    <span>PP</span>
    <i />
    <i />
  </div>
);

const KineticMark = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerTarget>({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();
  const [useFallback, setUseFallback] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const compact = window.matchMedia("(max-width: 700px), (pointer: coarse)").matches;
    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webgl = false;
    }
    setUseFallback(Boolean(reduceMotion) || compact || !webgl);
  }, [reduceMotion]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "20%" });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const handlePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current.x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
    pointer.current.y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
  };

  return (
    <div ref={hostRef} className="motionfolio-mark" onPointerMove={handlePointer} onPointerLeave={() => (pointer.current = { x: 0, y: 0 })}>
      {useFallback ? (
        <StaticMark />
      ) : (
        <Canvas
          dpr={[1, 1.4]}
          camera={{ position: [0, 0, 6.6], fov: 38 }}
          frameloop={visible ? "always" : "never"}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          aria-hidden="true"
        >
          <ambientLight intensity={0.72} />
          <directionalLight position={[-3, 4, 6]} intensity={5.4} color="#d7e2ff" />
          <pointLight position={[4, -2, 3]} intensity={18} color="#00d9ff" distance={9} />
          <pointLight position={[-4, 0, 2]} intensity={12} color="#864cff" distance={8} />
          <MarkGeometry pointer={pointer} />
        </Canvas>
      )}
    </div>
  );
};

export default KineticMark;
