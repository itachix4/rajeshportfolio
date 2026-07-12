import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { MotionValue } from "motion/react";
import type { BuildMode } from "../buildMode";
import CanvasFrameBudget from "../CanvasFrameBudget";

export type ForgeMode = BuildMode;

type ForgeSceneProps = {
  mode: ForgeMode;
  reducedMotion: boolean;
  onCycle: () => void;
  scrollProgress: MotionValue<number>;
};

const MODE_COLORS: Record<ForgeMode, string> = {
  engineer: "#ff6b35",
  designer: "#ff6b35",
  founder: "#ff6b35",
};

const SIGNAL_FIELD_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uScroll;

  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  varying float vDisplacement;

  void main() {
    // Two crossing waves create an organic field without a texture lookup.
    // Their frequencies are deliberately non-multiples, avoiding obvious loops.
    float travelingWave = sin(position.y * 4.1 + uTime * 0.9 + uPointer.x * 1.6);
    float crossWave = sin(position.x * 5.3 - uTime * 0.7)
      * cos(position.z * 4.7 + uTime * 0.52 + uPointer.y);
    float scrollWave = sin((position.y + uScroll) * 7.0) * uScroll;
    float pointerEnergy = 0.8 + length(uPointer) * 0.32;

    vDisplacement = (
      travelingWave * 0.052
      + crossWave * 0.038
      + scrollWave * 0.032
    ) * pointerEnergy;

    vec3 displacedPosition = position + normal * vDisplacement;
    vec4 viewPosition = modelViewMatrix * vec4(displacedPosition, 1.0);

    vViewPosition = viewPosition.xyz;
    vViewNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const SIGNAL_FIELD_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;

  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  varying float vDisplacement;

  void main() {
    vec3 viewDirection = normalize(-vViewPosition);
    float facing = abs(dot(normalize(vViewNormal), viewDirection));
    float fresnel = pow(1.0 - facing, 2.25);
    float interference = 0.5 + 0.5 * sin(vDisplacement * 82.0 - uTime * 1.35);
    float alpha = fresnel * (0.16 + interference * 0.24);
    vec3 hotEdge = vec3(1.0, 0.66, 0.43);
    vec3 color = mix(uColor, hotEdge, fresnel * 0.58);

    if (alpha < 0.018) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const SignalField = ({ scrollProgress }: Pick<ForgeSceneProps, "scrollProgress">) => {
  const material = useRef<THREE.ShaderMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const pointerVelocity = useRef(new THREE.Vector2());
  const { pointer } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uScroll: { value: 0 },
      uColor: { value: new THREE.Color("#ff6b35") },
    }),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!material.current || !mesh.current) return;

    // Damping makes pointer and scroll input frame-rate independent.
    pointerVelocity.current.x = THREE.MathUtils.damp(
      pointerVelocity.current.x,
      pointer.x,
      5,
      delta,
    );
    pointerVelocity.current.y = THREE.MathUtils.damp(
      pointerVelocity.current.y,
      pointer.y,
      5,
      delta,
    );
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uPointer.value.copy(pointerVelocity.current);
    material.current.uniforms.uScroll.value = scrollProgress.get();
    mesh.current.rotation.y = clock.elapsedTime * 0.055 + scrollProgress.get() * 0.8;
    mesh.current.rotation.z = scrollProgress.get() * -0.32;
  });

  return (
    <mesh ref={mesh} scale={1.42}>
      <icosahedronGeometry args={[1.18, 4]} />
      <shaderMaterial
        ref={material}
        vertexShader={SIGNAL_FIELD_VERTEX}
        fragmentShader={SIGNAL_FIELD_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
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
        color="#ffd0b8"
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
  scrollProgress,
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
    const scroll = scrollProgress.get();
    const targetX = reducedMotion
      ? 0.08
      : -pointer.y * 0.34 + Math.sin(clock.elapsedTime * 0.42) * 0.08 + scroll * 0.2;
    const targetY = pointer.x * 0.55 + drift + scroll * 1.05;
    const targetScale = (hovered ? 1.07 : 1) - scroll * 0.08;

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

const OrbitRig = ({ mode, reducedMotion, scrollProgress }: Omit<ForgeSceneProps, "onCycle">) => {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      clock.elapsedTime * -0.08 - scrollProgress.get() * 0.7,
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
    <SignalField scrollProgress={props.scrollProgress} />
    <OrbitRig
      mode={props.mode}
      reducedMotion={props.reducedMotion}
      scrollProgress={props.scrollProgress}
    />
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
