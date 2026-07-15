import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export type ShaderPreset = {
  id: string;
  primary: string;
  secondary: string;
  noise: number;
  fresnel: number;
  speed: number;
  distortion: number;
};

const vertexShader = `
uniform float uTime;
uniform float uDistortion;
varying vec3 vNormalW;
varying vec3 vPositionW;
varying float vDisplace;

// Compact value noise keeps the material self-contained and deterministic.
float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float noise(vec3 p) {
  vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                 mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                 mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
void main() {
  vec3 displaced = position;
  float n = noise(position * 1.8 + vec3(0.0, uTime * 0.18, 0.0));
  displaced += normal * (n - 0.5) * uDistortion;
  vec4 world = modelMatrix * vec4(displaced, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vPositionW = world.xyz;
  vDisplace = n;
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

const fragmentShader = `
uniform float uTime;
uniform float uNoise;
uniform float uFresnel;
uniform vec3 uPrimary;
uniform vec3 uSecondary;
uniform vec2 uMouse;
varying vec3 vNormalW;
varying vec3 vPositionW;
varying float vDisplace;
void main() {
  vec3 viewDirection = normalize(cameraPosition - vPositionW);
  float fresnel = pow(1.0 - max(dot(viewDirection, normalize(vNormalW)), 0.0), 1.5 + uFresnel * 3.0);
  float scan = sin((vPositionW.y + vDisplace * uNoise + uTime * 0.08) * 13.0 + uMouse.x * 2.0) * 0.5 + 0.5;
  vec3 base = mix(uPrimary, uSecondary, smoothstep(0.1, 0.9, vDisplace + scan * uNoise * 0.18));
  vec3 color = base + fresnel * mix(vec3(0.2), uSecondary, 0.7);
  gl_FragColor = vec4(color, 1.0);
}`;

const geometryMap = {
  sphere: <icosahedronGeometry args={[1.35, 48]} />,
  torus: <torusKnotGeometry args={[0.9, 0.28, 220, 32]} />,
  crystal: <octahedronGeometry args={[1.5, 8]} />,
};

const ForgedMesh = ({ preset, geometry, wireframe, paused }: {
  preset: ShaderPreset;
  geometry: keyof typeof geometryMap;
  wireframe: boolean;
  paused: boolean;
}) => {
  const mesh = useRef<THREE.Mesh>(null);
  const pointer = useRef(new THREE.Vector2());
  const { gl } = useThree();
  const uniforms = useRef({
    uTime: { value: 0 }, uNoise: { value: preset.noise }, uFresnel: { value: preset.fresnel },
    uDistortion: { value: preset.distortion }, uPrimary: { value: new THREE.Color(preset.primary) },
    uSecondary: { value: new THREE.Color(preset.secondary) }, uMouse: { value: pointer.current },
  }).current;

  useEffect(() => {
    uniforms.uNoise.value = preset.noise; uniforms.uFresnel.value = preset.fresnel;
    uniforms.uDistortion.value = preset.distortion; uniforms.uPrimary.value.set(preset.primary);
    uniforms.uSecondary.value.set(preset.secondary);
  }, [preset, uniforms]);

  useEffect(() => {
    const canvas = gl.domElement;
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -(((event.clientY - rect.top) / rect.height) * 2 - 1));
    };
    canvas.addEventListener("pointermove", move, { passive: true });
    return () => canvas.removeEventListener("pointermove", move);
  }, [gl]);

  useFrame((state, delta) => {
    if (!mesh.current || paused) return;
    uniforms.uTime.value += delta * preset.speed;
    mesh.current.rotation.y += delta * 0.18;
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, pointer.current.y * 0.22, 0.045);
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, pointer.current.x * 0.35 + state.clock.elapsedTime * 0.11, 0.025);
  });

  return <mesh ref={mesh}>{geometryMap[geometry]}<shaderMaterial key={`${geometry}-${wireframe}`} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} wireframe={wireframe} /></mesh>;
};

const ShaderViewport = (props: { preset: ShaderPreset; geometry: keyof typeof geometryMap; wireframe: boolean; paused: boolean }) => (
  <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.6], fov: 44 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
    <color attach="background" args={["#070807"]} />
    <ForgedMesh {...props} />
  </Canvas>
);

export default ShaderViewport;
