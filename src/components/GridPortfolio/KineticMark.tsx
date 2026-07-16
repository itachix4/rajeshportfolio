"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

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

const SceneEnvironment = () => {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = environment.texture;
    return () => {
      scene.environment = null;
      environment.texture.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
};

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
            color={index % 2 ? "#2b52ff" : "#12309f"}
            metalness={0.58}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.08}
            envMapIntensity={1.2}
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

const supportsKineticMark = () => {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(max-width: 700px), (pointer: coarse)").matches) return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
};

const KineticMark = ({ variant = "auto" }: { variant?: "auto" | "static" }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerTarget>({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();
  const [capable] = useState(supportsKineticMark);
  const [visible, setVisible] = useState(true);
  const useFallback = variant === "static" || Boolean(reduceMotion) || !capable;

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
          gl={{ antialias: true, alpha: true, powerPreference: "default" }}
          aria-hidden="true"
        >
          <SceneEnvironment />
          <ambientLight intensity={0.6} />
          <directionalLight position={[-3, 4, 6]} intensity={5.2} color="#d7e2ff" />
          <pointLight position={[4, -2, 3]} intensity={16} color="#ff8a3d" distance={9} />
          <pointLight position={[-4, 0, 2]} intensity={11} color="#4d74ff" distance={8} />
          <MarkGeometry pointer={pointer} />
        </Canvas>
      )}
    </div>
  );
};

export default KineticMark;
