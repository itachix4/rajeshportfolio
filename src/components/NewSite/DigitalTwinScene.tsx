import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { BuildMode } from "../buildMode";

type DigitalTwinSceneProps = {
  mode: BuildMode;
  reducedMotion: boolean;
};

const MODE_COLORS: Record<BuildMode, string> = {
  designer: "#ff6a2b",
  engineer: "#64d2ff",
  founder: "#ffb13b",
};

const TwinWorld = ({ mode, reducedMotion }: DigitalTwinSceneProps) => {
  const rig = useRef<THREE.Group>(null);
  const portrait = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const texture = useLoader(THREE.TextureLoader, "/images/parth-digital-twin.jpg");
  const accent = MODE_COLORS[mode];

  const portraitGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(3.5, 4.68, 36, 36);
    const positions = geometry.attributes.position;

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      positions.setZ(index, -0.045 * x * x);
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const particles = useMemo(() => {
    const positions = new Float32Array(42 * 3);
    for (let index = 0; index < 42; index += 1) {
      const offset = index * 3;
      positions[offset] = (Math.random() - 0.5) * 5.4;
      positions[offset + 1] = (Math.random() - 0.5) * 6.2;
      positions[offset + 2] = (Math.random() - 0.5) * 2.4 - 0.4;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!rig.current || !portrait.current) return;

    const targetX = reducedMotion ? 0 : pointer.y * 0.055;
    const targetY = reducedMotion ? 0 : pointer.x * 0.105;
    rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, targetX, 4.8, delta);
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, targetY, 4.8, delta);

    const float = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.62) * 0.025;
    rig.current.position.y = THREE.MathUtils.damp(rig.current.position.y, float, 3, delta);
    portrait.current.position.z = THREE.MathUtils.damp(
      portrait.current.position.z,
      reducedMotion ? 0 : pointer.x * 0.025,
      4,
      delta,
    );
  });

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 5.2, 9]} />

      <group ref={rig}>
        <mesh position={[0, 0, -0.22]}>
          <planeGeometry args={[3.72, 4.9]} />
          <meshBasicMaterial color="#090909" />
        </mesh>

        <mesh ref={portrait} geometry={portraitGeometry}>
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>

        <mesh position={[0.18, 0.06, -0.42]} rotation={[0.14, 0.16, 0.08]}>
          <torusGeometry args={[1.72, 0.012, 12, 96]} />
          <meshBasicMaterial color={accent} transparent opacity={0.64} />
        </mesh>
        <mesh position={[-0.18, 0.02, 0.22]} rotation={[-0.08, -0.18, -0.11]}>
          <torusGeometry args={[1.95, 0.006, 10, 96]} />
          <meshBasicMaterial color={accent} transparent opacity={0.22} />
        </mesh>

        <mesh position={[-1.52, 0.54, 0.34]} rotation={[0.05, -0.42, -0.05]}>
          <planeGeometry args={[0.5, 2.4]} />
          <meshBasicMaterial color={accent} transparent opacity={0.075} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[1.52, -0.58, 0.18]} rotation={[-0.05, 0.42, 0.05]}>
          <planeGeometry args={[0.42, 1.72]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.045} side={THREE.DoubleSide} />
        </mesh>

        <points position={[0, 0, 0.55]}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[particles, 3]} />
          </bufferGeometry>
          <pointsMaterial color={accent} size={0.018} transparent opacity={0.62} sizeAttenuation />
        </points>
      </group>
    </>
  );
};

const DigitalTwinScene = ({ mode, reducedMotion }: DigitalTwinSceneProps) => (
  <Canvas
    aria-hidden="true"
    camera={{ position: [0, 0, 5.45], fov: 43 }}
    dpr={[1, 1.5]}
    gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
  >
    <TwinWorld mode={mode} reducedMotion={reducedMotion} />
  </Canvas>
);

export default DigitalTwinScene;
