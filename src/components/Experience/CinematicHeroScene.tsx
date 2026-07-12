import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import CanvasFrameBudget from "../CanvasFrameBudget";
import type { BuildMode } from "../buildMode";

type CinematicHeroSceneProps = {
  mode: BuildMode;
  scrollProgress: MotionValue<number>;
};

const CORE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uScroll;

  varying vec3 vNormalView;
  varying vec3 vViewPosition;
  varying float vEnergy;

  void main() {
    float waveA = sin(position.y * 3.8 + uTime * 0.72 + uPointer.x * 1.4);
    float waveB = cos(position.x * 4.6 - uTime * 0.54 + uPointer.y * 1.2);
    float waveC = sin((position.z + position.x) * 5.2 + uTime * 0.38);
    float displacement = (waveA * 0.045 + waveB * 0.035 + waveC * 0.025)
      * (1.0 + uScroll * 0.5);

    vec3 displaced = position + normal * displacement;
    vec4 viewPosition = modelViewMatrix * vec4(displaced, 1.0);
    vNormalView = normalize(normalMatrix * normal);
    vViewPosition = viewPosition.xyz;
    vEnergy = displacement;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const CORE_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uOrange;

  varying vec3 vNormalView;
  varying vec3 vViewPosition;
  varying float vEnergy;

  void main() {
    vec3 viewDirection = normalize(-vViewPosition);
    float fresnel = pow(1.0 - abs(dot(vNormalView, viewDirection)), 2.35);
    float pulse = 0.5 + 0.5 * sin(uTime * 0.9 + vEnergy * 90.0);
    vec3 graphite = vec3(0.025, 0.025, 0.025);
    vec3 color = mix(graphite, uOrange, fresnel * (0.72 + pulse * 0.28));
    float alpha = 0.28 + fresnel * 0.68;
    gl_FragColor = vec4(color, alpha);
  }
`;

const HeroParticles = () => {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 140;
    const values = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const angle = index * 2.399963;
      const radius = 2.4 + (index % 17) * 0.24;
      values[index * 3] = Math.cos(angle) * radius;
      values[index * 3 + 1] = ((index * 0.618) % 1 - 0.5) * 8.5;
      values[index * 3 + 2] = Math.sin(angle) * radius - 1.8;
    }

    return values;
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    points.current.rotation.y = clock.elapsedTime * 0.018;
    points.current.rotation.z = Math.sin(clock.elapsedTime * 0.07) * 0.05;
  });

  return (
    <points ref={points} frustumCulled>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ff8a47"
        size={0.024}
        sizeAttenuation
        transparent
        opacity={0.48}
        depthWrite={false}
      />
    </points>
  );
};

const OrbitalLines = ({ mode }: { mode: BuildMode }) => {
  const group = useRef<THREE.Group>(null);
  const speed = mode === "engineer" ? 0.11 : mode === "designer" ? 0.075 : 0.055;

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.z = clock.elapsedTime * speed;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.16) * 0.18;
  });

  return (
    <group ref={group}>
      {[
        { radius: 1.8, rotation: [1.25, 0.25, 0] },
        { radius: 2.18, rotation: [0.65, -0.4, 0.2] },
        { radius: 2.62, rotation: [1.7, 0.45, -0.24] },
      ].map((orbit, index) => (
        <mesh key={orbit.radius} rotation={orbit.rotation as [number, number, number]}>
          <torusGeometry args={[orbit.radius, index === 0 ? 0.014 : 0.008, 8, 160]} />
          <meshBasicMaterial
            color={index === 0 ? "#ff6a00" : "#8d7a6b"}
            transparent
            opacity={0.46 - index * 0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

const HeroCore = ({ mode, scrollProgress }: CinematicHeroSceneProps) => {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const pointerTarget = useRef(new THREE.Vector2());
  const { pointer } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uScroll: { value: 0 },
      uOrange: { value: new THREE.Color("#ff6a00") },
    }),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!mesh.current || !material.current) return;
    const scroll = scrollProgress.get();
    pointerTarget.current.x = THREE.MathUtils.damp(pointerTarget.current.x, pointer.x, 4.5, delta);
    pointerTarget.current.y = THREE.MathUtils.damp(pointerTarget.current.y, pointer.y, 4.5, delta);
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uPointer.value.copy(pointerTarget.current);
    material.current.uniforms.uScroll.value = scroll;

    const modeSpeed = mode === "engineer" ? 0.22 : mode === "designer" ? 0.14 : 0.095;
    mesh.current.rotation.x = clock.elapsedTime * modeSpeed * 0.42 + pointerTarget.current.y * 0.18;
    mesh.current.rotation.y = clock.elapsedTime * modeSpeed + pointerTarget.current.x * 0.26 + scroll * 1.2;
    mesh.current.scale.setScalar(1 - scroll * 0.12);
  });

  return (
    <mesh ref={mesh} scale={1.35}>
      <icosahedronGeometry args={[1.12, 5]} />
      <shaderMaterial
        ref={material}
        vertexShader={CORE_VERTEX}
        fragmentShader={CORE_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const CameraRig = ({ scrollProgress }: Pick<CinematicHeroSceneProps, "scrollProgress">) => {
  const { camera, pointer } = useThree();

  useFrame((_, delta) => {
    const scroll = scrollProgress.get();
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.34, 3.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointer.y * 0.22 - scroll * 0.28, 3.2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 6.5 - scroll * 0.7, 3.2, delta);
    camera.lookAt(0, -scroll * 0.18, 0);
  });

  return null;
};

const HeroWorld = (props: CinematicHeroSceneProps) => (
  <>
    <ambientLight intensity={0.28} />
    <pointLight position={[3, 3, 4]} color="#ff6a00" intensity={16} />
    <pointLight position={[-3, -2, 2]} color="#fff4e8" intensity={4} />
    <HeroParticles />
    <OrbitalLines mode={props.mode} />
    <HeroCore {...props} />
    <CameraRig scrollProgress={props.scrollProgress} />
  </>
);

const CinematicHeroScene = (props: CinematicHeroSceneProps) => (
  <Canvas
    aria-hidden="true"
    camera={{ position: [0, 0, 6.5], fov: 42, near: 0.1, far: 40 }}
    dpr={[1, 1.5]}
    gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    onCreated={({ gl }) => {
      gl.outputColorSpace = THREE.SRGBColorSpace;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1;
    }}
  >
    <CanvasFrameBudget reducedMotion={false} />
    <HeroWorld {...props} />
  </Canvas>
);

export default CinematicHeroScene;
