import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import CanvasFrameBudget from "../CanvasFrameBudget";

type ProjectGalaxySceneProps = {
  selectedId: string | null;
  zoomLevel: number;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
};

const PROJECT_POSITION = new THREE.Vector3(2.35, 0.14, 0.18);

const StarField = () => {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 320;
    const values = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const angle = index * 2.399963;
      const layer = 5.5 + (index % 29) * 0.19;
      values[index * 3] = Math.cos(angle) * layer;
      values[index * 3 + 1] = ((index * 0.754877) % 1 - 0.5) * 10;
      values[index * 3 + 2] = Math.sin(angle) * layer - 3;
    }

    return values;
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    points.current.rotation.y = clock.elapsedTime * 0.006;
  });

  return (
    <points ref={points} frustumCulled>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d9d2c8" size={0.018} transparent opacity={0.52} depthWrite={false} />
    </points>
  );
};

const SystemCore = () => {
  const core = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!core.current) return;
    core.current.rotation.y = clock.elapsedTime * 0.12;
    core.current.rotation.z = clock.elapsedTime * -0.05;
  });

  return (
    <group ref={core}>
      <mesh>
        <icosahedronGeometry args={[0.72, 4]} />
        <meshStandardMaterial
          color="#ff6a00"
          emissive="#ff4300"
          emissiveIntensity={2.6}
          metalness={0.28}
          roughness={0.22}
        />
      </mesh>
      <mesh scale={1.34}>
        <icosahedronGeometry args={[0.72, 2]} />
        <meshBasicMaterial color="#ff8a3d" transparent opacity={0.08} wireframe />
      </mesh>
      {[1.16, 1.48].map((radius, index) => (
        <mesh key={radius} rotation={[Math.PI / 2 + index * 0.42, 0.2, index * 0.7]}>
          <torusGeometry args={[radius, index === 0 ? 0.012 : 0.006, 8, 128]} />
          <meshBasicMaterial color="#ff6a00" transparent opacity={0.38 - index * 0.12} />
        </mesh>
      ))}
      <pointLight color="#ff5a00" intensity={22} distance={8} decay={2} />
    </group>
  );
};

const ForgeMark = () => (
  <group position={[0, 0, 0.78]} scale={0.25}>
    <mesh position={[-0.28, 0, 0]}>
      <boxGeometry args={[0.22, 1.05, 0.12]} />
      <meshBasicMaterial color="#0b0b0b" />
    </mesh>
    <mesh position={[0.04, 0.41, 0]}>
      <boxGeometry args={[0.64, 0.22, 0.12]} />
      <meshBasicMaterial color="#0b0b0b" />
    </mesh>
    <mesh position={[-0.02, 0.02, 0]}>
      <boxGeometry args={[0.52, 0.2, 0.12]} />
      <meshBasicMaterial color="#0b0b0b" />
    </mesh>
  </group>
);

const ProjectPlanet = ({
  selected,
  onSelect,
  onHover,
}: {
  selected: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}) => {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const targetScale = selected ? 1.18 : hovered ? 1.08 : 1;
    const nextScale = THREE.MathUtils.damp(group.current.scale.x, targetScale, 5, delta);
    group.current.scale.setScalar(nextScale);
    group.current.rotation.y += delta * (selected ? 0.1 : 0.18);
    group.current.position.y = PROJECT_POSITION.y + Math.sin(clock.elapsedTime * 0.62) * 0.08;
  });

  const setHoverState = (value: boolean) => {
    setHovered(value);
    onHover(value);
  };

  return (
    <group
      ref={group}
      position={PROJECT_POSITION}
      onPointerEnter={(event) => {
        event.stopPropagation();
        setHoverState(true);
      }}
      onPointerLeave={() => setHoverState(false)}
      onClick={(event) => {
        event.stopPropagation();
        if (event.delta < 5) onSelect();
      }}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.72, 64, 64]} />
        <meshStandardMaterial
          color="#ff6a00"
          emissive="#6b1f00"
          emissiveIntensity={0.7}
          roughness={0.38}
          metalness={0.32}
        />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[0.72, 48, 48]} />
        <meshBasicMaterial
          color="#ffb36b"
          transparent
          opacity={hovered || selected ? 0.2 : 0.1}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh rotation={[1.22, 0.18, -0.2]}>
        <torusGeometry args={[1.08, 0.055, 16, 180]} />
        <meshStandardMaterial color="#f0d5be" metalness={0.72} roughness={0.24} />
      </mesh>
      <ForgeMark />

      {[
        { position: [-1.42, 0.25, -0.15], size: 0.12 },
        { position: [1.4, -0.26, -0.35], size: 0.09 },
        { position: [-0.25, 1.28, -0.55], size: 0.075 },
      ].map((moon, index) => (
        <mesh key={index} position={moon.position as [number, number, number]}>
          <sphereGeometry args={[moon.size, 16, 16]} />
          <meshStandardMaterial color={index === 0 ? "#f5eee7" : "#5d5148"} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

const SystemOrbit = ({ children }: { children: ReactNode }) => {
  const group = useRef<THREE.Group>(null);
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: -0.06, y: -0.18 });

  useFrame((_, delta) => {
    if (!group.current) return;
    if (!dragging.current) targetRotation.current.y += delta * 0.035;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetRotation.current.x, 7, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotation.current.y, 7, delta);
  });

  const startDrag = (event: ThreeEvent<PointerEvent>) => {
    dragging.current = true;
    lastPointer.current = { x: event.clientX, y: event.clientY };
  };

  const moveDrag = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return;
    const deltaX = event.clientX - lastPointer.current.x;
    const deltaY = event.clientY - lastPointer.current.y;
    targetRotation.current.y += deltaX * 0.005;
    targetRotation.current.x = THREE.MathUtils.clamp(targetRotation.current.x + deltaY * 0.003, -0.42, 0.42);
    lastPointer.current = { x: event.clientX, y: event.clientY };
  };

  return (
    <group
      ref={group}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
    >
      {children}
    </group>
  );
};

const CameraFlight = ({ selectedId, zoomLevel }: Pick<ProjectGalaxySceneProps, "selectedId" | "zoomLevel">) => {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3());
  const desiredPosition = useRef(new THREE.Vector3());
  const desiredLook = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const selected = Boolean(selectedId);
    if (selected) {
      desiredPosition.current.set(PROJECT_POSITION.x + 0.08, PROJECT_POSITION.y + 0.05, 3.15);
      desiredLook.current.copy(PROJECT_POSITION);
    } else {
      desiredPosition.current.set(0, 0.12, 7.1 - zoomLevel * 0.42);
      desiredLook.current.set(0.35, 0, 0);
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredPosition.current.x, 3.4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredPosition.current.y, 3.4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredPosition.current.z, 3.4, delta);
    lookTarget.current.lerp(desiredLook.current, 1 - Math.exp(-delta * 3.8));
    camera.lookAt(lookTarget.current);
  });

  return null;
};

const GalaxyWorld = ({ selectedId, zoomLevel, onSelect, onHover }: ProjectGalaxySceneProps) => (
  <>
    <ambientLight intensity={0.32} />
    <directionalLight position={[4, 4, 5]} intensity={4.2} color="#fff2e5" />
    <pointLight position={[-4, -2, 3]} intensity={8} color="#ff6a00" />
    <StarField />
    <SystemOrbit>
      <SystemCore />
      <ProjectPlanet
        selected={selectedId === "forgelane"}
        onSelect={() => onSelect("forgelane")}
        onHover={(hovered) => onHover(hovered ? "forgelane" : null)}
      />
    </SystemOrbit>
    <CameraFlight selectedId={selectedId} zoomLevel={zoomLevel} />
  </>
);

const ProjectGalaxyScene = (props: ProjectGalaxySceneProps) => (
  <Canvas
    aria-hidden="true"
    camera={{ position: [0, 0.12, 7.1], fov: 42, near: 0.1, far: 50 }}
    dpr={[1, 1.5]}
    gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    onCreated={({ gl }) => {
      gl.outputColorSpace = THREE.SRGBColorSpace;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.04;
    }}
  >
    <CanvasFrameBudget reducedMotion={false} />
    <GalaxyWorld {...props} />
  </Canvas>
);

export default ProjectGalaxyScene;
