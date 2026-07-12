import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { BuildMode } from "../buildMode";
import CanvasFrameBudget from "../CanvasFrameBudget";

export type ForgeMode = BuildMode;

type ForgeSceneProps = {
  mode: ForgeMode;
  reducedMotion: boolean;
  onCycle: () => void;
};

const MODE_COLORS: Record<ForgeMode, string> = {
  engineer: "#ff6b35",
  designer: "#ff6b35",
  founder: "#ff6b35",
};

const stopAndCycle = (event: ThreeEvent<MouseEvent>, onCycle: () => void) => {
  event.stopPropagation();
  onCycle();
};

const EngineerCore = () => (
  <group>
    <mesh castShadow>
      <torusKnotGeometry args={[1.08, 0.3, 180, 28, 2, 3]} />
      <meshStandardMaterial color="#ff6b35" metalness={0.82} roughness={0.22} />
    </mesh>
    <mesh scale={1.055}>
      <torusKnotGeometry args={[1.08, 0.3, 120, 18, 2, 3]} />
      <meshBasicMaterial
        color="#d7f4ff"
        transparent
        opacity={0.2}
        wireframe
      />
    </mesh>
  </group>
);

const DesignerCore = () => (
  <group>
    {[
      [0, 0, 0],
      [Math.PI / 2, 0.35, 0],
      [0.45, Math.PI / 2, 0.2],
    ].map((rotation, index) => (
      <mesh key={index} rotation={rotation as [number, number, number]}>
        <torusGeometry args={[1.18, 0.17, 24, 120]} />
        <meshStandardMaterial
          color={index === 1 ? "#ff5a1f" : "#ffae87"}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
    ))}
    <mesh>
      <icosahedronGeometry args={[0.52, 4]} />
      <meshStandardMaterial color="#130906" metalness={0.35} roughness={0.15} />
    </mesh>
  </group>
);

const FounderCore = () => (
  <group rotation={[0.18, 0.2, 0.12]}>
    {[
      { position: [-0.62, 0.5, 0.08], rotation: [0.1, 0.3, -0.08], scale: [1.35, 0.78, 0.44] },
      { position: [0.53, 0.22, -0.12], rotation: [-0.18, -0.3, 0.13], scale: [1.05, 1.2, 0.48] },
      { position: [-0.05, -0.68, 0.18], rotation: [0.28, 0.1, -0.2], scale: [1.45, 0.7, 0.42] },
    ].map((block, index) => (
      <mesh
        key={index}
        position={block.position as [number, number, number]}
        rotation={block.rotation as [number, number, number]}
        scale={block.scale as [number, number, number]}
        castShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={index === 1 ? "#ff5a1f" : "#e8e3d9"}
          metalness={0.62}
          roughness={0.28}
        />
      </mesh>
    ))}
  </group>
);

const InteractiveCore = ({
  mode,
  reducedMotion,
  onCycle,
}: ForgeSceneProps) => {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { pointer } = useThree();

  useEffect(() => {
    if (!hovered) return;
    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = previousCursor;
    };
  }, [hovered]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;

    const drift = reducedMotion ? 0 : clock.elapsedTime * 0.14;
    const targetX = reducedMotion ? 0.08 : -pointer.y * 0.34 + Math.sin(clock.elapsedTime * 0.42) * 0.08;
    const targetY = pointer.x * 0.55 + drift;
    const targetScale = hovered ? 1.07 : 1;

    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      targetX,
      4.2,
      delta
    );
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetY,
      3.8,
      delta
    );
    group.current.scale.setScalar(
      THREE.MathUtils.damp(group.current.scale.x, targetScale, 5, delta)
    );
    group.current.position.y = reducedMotion
      ? 0
      : Math.sin(clock.elapsedTime * 0.7) * 0.08;
  });

  return (
    <group
      ref={group}
      onClick={(event) => stopAndCycle(event, onCycle)}
      onPointerEnter={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
    >
      {mode === "engineer" && <EngineerCore />}
      {mode === "designer" && <DesignerCore />}
      {mode === "founder" && <FounderCore />}
    </group>
  );
};

const OrbitRig = ({ mode, reducedMotion }: Omit<ForgeSceneProps, "onCycle">) => {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      clock.elapsedTime * -0.08,
      2,
      delta
    );
  });

  return (
    <group ref={group}>
      {[
        { rotation: [Math.PI / 2, 0, 0], radius: 1.95 },
        { rotation: [0.7, 0.45, 0.2], radius: 2.22 },
        { rotation: [1.25, -0.52, 0.1], radius: 2.48 },
      ].map((orbit, index) => (
        <mesh
          key={index}
          rotation={orbit.rotation as [number, number, number]}
        >
          <torusGeometry args={[orbit.radius, index === 1 ? 0.012 : 0.007, 8, 144]} />
          <meshBasicMaterial
            color={MODE_COLORS[mode]}
            transparent
            opacity={0.42 - index * 0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

const ParticleField = ({ mode }: { mode: ForgeMode }) => {
  const positions = useMemo(
    () =>
      Array.from({ length: 22 }, (_, index) => {
        const angle = index * 2.399;
        const radius = 2.45 + (index % 4) * 0.32;
        return [
          Math.cos(angle) * radius,
          Math.sin(angle * 1.4) * 2.15,
          Math.sin(angle) * radius * 0.42,
        ] as [number, number, number];
      }),
    []
  );

  return (
    <group>
      {positions.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[index % 5 === 0 ? 0.035 : 0.018, 8, 8]} />
          <meshBasicMaterial
            color={index % 4 === 0 ? MODE_COLORS[mode] : "#77736d"}
            transparent
            opacity={0.72}
          />
        </mesh>
      ))}
    </group>
  );
};

const ForgeWorld = (props: ForgeSceneProps) => (
  <>
    <ambientLight intensity={0.42} />
    <spotLight
      position={[3.5, 4, 4.5]}
      color={MODE_COLORS[props.mode]}
      intensity={34}
      angle={0.42}
      penumbra={0.8}
    />
    <pointLight position={[-3, -2, 2]} color={MODE_COLORS[props.mode]} intensity={10} />
    <pointLight position={[0, 0, -2]} color="#ffffff" intensity={5} />
    <ParticleField mode={props.mode} />
    <OrbitRig mode={props.mode} reducedMotion={props.reducedMotion} />
    <InteractiveCore {...props} />
  </>
);

const ForgeScene = (props: ForgeSceneProps) => (
  <Canvas
    aria-hidden="true"
    camera={{ position: [0, 0, 5.6], fov: 40, near: 0.1, far: 30 }}
    dpr={[1, 1.5]}
    frameloop={props.reducedMotion ? "demand" : "always"}
    gl={{
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    }}
    onCreated={({ gl }) => {
      gl.outputColorSpace = THREE.SRGBColorSpace;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.08;
    }}
  >
    <CanvasFrameBudget reducedMotion={props.reducedMotion} />
    <ForgeWorld {...props} />
  </Canvas>
);

export default ForgeScene;
