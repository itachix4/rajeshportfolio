import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { BuildMode } from "../buildMode";

type SkillConstellationSceneProps = {
  mode: BuildMode;
  activeSkillIndex: number;
  reducedMotion: boolean;
  onSelectSkill: (index: number) => void;
};

const MODE_COLORS: Record<BuildMode, string> = {
  designer: "#ff6a2b",
  engineer: "#64d2ff",
  founder: "#ff9f0a",
};

const NODE_POSITIONS: Array<[number, number, number]> = [
  [-2.15, 1.1, 0.15],
  [0, 1.72, -0.35],
  [2.15, 1.05, 0.12],
  [-2.05, -1.12, -0.12],
  [0, -1.68, 0.35],
  [2.08, -1.08, -0.08],
];

const ConstellationNode = ({
  index,
  active,
  color,
  onSelect,
}: {
  index: number;
  active: boolean;
  color: string;
  onSelect: (index: number) => void;
}) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hovered) return;
    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = previousCursor;
    };
  }, [hovered]);

  const selectNode = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(index % 3);
  };

  return (
    <group position={NODE_POSITIONS[index]}>
      <mesh
        scale={active ? 1.24 : hovered ? 1.1 : 1}
        onClick={selectNode}
        onPointerEnter={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
      >
        <icosahedronGeometry args={[active ? 0.25 : 0.19, 2]} />
        <meshStandardMaterial
          color={active ? color : "#c7c7cc"}
          emissive={active ? color : "#151517"}
          emissiveIntensity={active ? 1.2 : 0.18}
          metalness={0.65}
          roughness={0.25}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, index * 0.4]}>
        <torusGeometry args={[active ? 0.38 : 0.29, 0.008, 6, 64]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.78 : 0.26} />
      </mesh>
    </group>
  );
};

const ConstellationWorld = ({
  mode,
  activeSkillIndex,
  reducedMotion,
  onSelectSkill,
}: SkillConstellationSceneProps) => {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const color = MODE_COLORS[mode];

  const lineGeometry = useMemo(() => {
    const points = NODE_POSITIONS.flatMap((position) => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(...position),
    ]);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => {
        const angle = index * 2.399;
        const radius = 2.4 + (index % 4) * 0.34;
        return [
          Math.cos(angle) * radius,
          Math.sin(angle * 1.35) * 1.8,
          Math.sin(angle) * 0.7,
        ] as [number, number, number];
      }),
    []
  );

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const drift = reducedMotion ? 0 : clock.elapsedTime * 0.035;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      pointer.x * 0.16 + drift,
      3.5,
      delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      -pointer.y * 0.09,
      3.5,
      delta
    );
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={color} transparent opacity={0.3} />
      </lineSegments>

      <mesh>
        <icosahedronGeometry args={[0.5, 3]} />
        <meshStandardMaterial
          color="#f5f5f7"
          emissive={color}
          emissiveIntensity={0.34}
          metalness={0.86}
          roughness={0.16}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.82, 0.012, 8, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.62} />
      </mesh>

      {NODE_POSITIONS.map((_, index) => (
        <ConstellationNode
          key={index}
          index={index}
          active={index % 3 === activeSkillIndex}
          color={color}
          onSelect={onSelectSkill}
        />
      ))}

      {particles.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[index % 5 === 0 ? 0.025 : 0.012, 6, 6]} />
          <meshBasicMaterial color={index % 4 === 0 ? color : "#707075"} />
        </mesh>
      ))}
    </group>
  );
};

const SkillConstellationScene = (props: SkillConstellationSceneProps) => (
  <Canvas
    aria-hidden="true"
    camera={{ position: [0, 0, 6.4], fov: 42, near: 0.1, far: 24 }}
    dpr={[1, 1.5]}
    frameloop={props.reducedMotion ? "demand" : "always"}
    gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    onCreated={({ gl }) => {
      gl.outputColorSpace = THREE.SRGBColorSpace;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.08;
    }}
  >
    <ambientLight intensity={0.48} />
    <pointLight position={[0, 1, 4]} color={MODE_COLORS[props.mode]} intensity={16} />
    <pointLight position={[-3, -2, 2]} color="#ffffff" intensity={5} />
    <ConstellationWorld {...props} />
  </Canvas>
);

export default SkillConstellationScene;
