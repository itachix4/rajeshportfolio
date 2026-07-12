import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import CanvasFrameBudget from "../CanvasFrameBudget";

export type LabSceneKind = "raymarch" | "particles" | "reaction";

const FULLSCREEN_VERTEX = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const RAYMARCH_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uPointer;
  varying vec2 vUv;

  const int MAX_STEPS = 84;
  const float MAX_DISTANCE = 11.0;
  const float SURFACE_EPSILON = 0.0012;

  mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  float sphereSdf(vec3 point, float radius) {
    return length(point) - radius;
  }

  float torusSdf(vec3 point, vec2 radii) {
    vec2 ring = vec2(length(point.xz) - radii.x, point.y);
    return length(ring) - radii.y;
  }

  float smoothUnion(float distanceA, float distanceB, float radius) {
    float blend = clamp(0.5 + 0.5 * (distanceB - distanceA) / radius, 0.0, 1.0);
    return mix(distanceB, distanceA, blend) - radius * blend * (1.0 - blend);
  }

  float sceneSdf(vec3 point) {
    point.xz *= rotate2d(uTime * 0.18 + uPointer.x * 0.34);
    point.xy *= rotate2d(-uTime * 0.11 + uPointer.y * 0.28);

    vec3 spherePoint = point;
    spherePoint.x += sin(uTime * 0.8) * 0.42;
    float sphere = sphereSdf(spherePoint, 0.74);

    vec3 torusPoint = point;
    torusPoint.yz *= rotate2d(1.12 + sin(uTime * 0.34) * 0.24);
    float torus = torusSdf(torusPoint, vec2(1.08, 0.21));

    vec3 satellitePoint = point - vec3(
      cos(uTime * 0.7) * 1.05,
      sin(uTime * 0.9) * 0.64,
      sin(uTime * 0.7) * 0.5
    );
    float satellite = sphereSdf(satellitePoint, 0.34);

    return smoothUnion(smoothUnion(sphere, torus, 0.38), satellite, 0.26);
  }

  vec3 estimateNormal(vec3 point) {
    vec2 epsilon = vec2(SURFACE_EPSILON, 0.0);
    return normalize(vec3(
      sceneSdf(point + epsilon.xyy) - sceneSdf(point - epsilon.xyy),
      sceneSdf(point + epsilon.yxy) - sceneSdf(point - epsilon.yxy),
      sceneSdf(point + epsilon.yyx) - sceneSdf(point - epsilon.yyx)
    ));
  }

  float raymarch(vec3 origin, vec3 direction, out vec3 hitPoint) {
    float distanceTravelled = 0.0;

    for (int step = 0; step < MAX_STEPS; step++) {
      hitPoint = origin + direction * distanceTravelled;
      float distanceToSurface = sceneSdf(hitPoint);
      if (distanceToSurface < SURFACE_EPSILON || distanceTravelled > MAX_DISTANCE) break;
      distanceTravelled += distanceToSurface * 0.78;
    }

    return distanceTravelled;
  }

  void main() {
    vec2 screen = vUv * 2.0 - 1.0;
    screen.x *= uAspect;

    vec3 rayOrigin = vec3(uPointer.x * 0.32, uPointer.y * 0.24, 4.1);
    vec3 rayDirection = normalize(vec3(screen * 0.78, -1.8));
    vec3 hitPoint;
    float distanceTravelled = raymarch(rayOrigin, rayDirection, hitPoint);

    vec3 background = vec3(0.008, 0.008, 0.009);
    float grid = smoothstep(0.98, 1.0, sin(screen.x * 34.0) * sin(screen.y * 34.0));
    background += grid * vec3(0.025);

    if (distanceTravelled > MAX_DISTANCE) {
      gl_FragColor = vec4(background, 1.0);
      return;
    }

    vec3 normal = estimateNormal(hitPoint);
    vec3 lightDirection = normalize(vec3(-0.5 + uPointer.x, 0.8, 0.9));
    float diffuse = max(dot(normal, lightDirection), 0.0);
    float fresnel = pow(1.0 - max(dot(normal, -rayDirection), 0.0), 3.0);
    float bands = 0.5 + 0.5 * sin(hitPoint.y * 18.0 + uTime * 1.8);

    vec3 orange = vec3(1.0, 0.31, 0.11);
    vec3 warmEdge = vec3(1.0, 0.66, 0.42);
    vec3 color = orange * (0.12 + diffuse * 0.88);
    color += warmEdge * fresnel * (0.62 + bands * 0.22);
    color += vec3(1.0) * pow(max(dot(reflect(-lightDirection, normal), -rayDirection), 0.0), 42.0);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const RaymarchPiece = () => {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { pointer, size } = useThree();
  const pointerTarget = useRef(new THREE.Vector2());
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uPointer: { value: new THREE.Vector2() },
    }),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!material.current) return;
    pointerTarget.current.x = THREE.MathUtils.damp(pointerTarget.current.x, pointer.x, 5, delta);
    pointerTarget.current.y = THREE.MathUtils.damp(pointerTarget.current.y, pointer.y, 5, delta);
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uAspect.value = size.width / Math.max(size.height, 1);
    material.current.uniforms.uPointer.value.copy(pointerTarget.current);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={FULLSCREEN_VERTEX}
        fragmentShader={RAYMARCH_FRAGMENT}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

const PARTICLE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vEnergy;

  mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  void main() {
    vec3 point = position;
    float phase = uTime * 0.22 + aSeed * 6.28318;

    // This analytic field is divergence-light: each axis is driven by the
    // other two, producing curl-like circulation without CPU integration.
    vec3 flow = vec3(
      sin(point.y * 1.2 + phase) - cos(point.z * 1.1 - phase),
      sin(point.z * 1.3 - phase) - cos(point.x * 1.2 + phase),
      sin(point.x * 1.1 + phase) - cos(point.y * 1.3 - phase)
    );
    point += flow * (0.36 + aSeed * 0.18);
    point.xz *= rotate2d(uTime * 0.04);

    vec2 pointerPosition = uPointer * vec2(2.4, 1.65);
    vec2 pointerDelta = pointerPosition - point.xy;
    float influence = exp(-dot(pointerDelta, pointerDelta) * 0.72);
    point.xy += pointerDelta * influence * 0.32;

    vec4 viewPosition = modelViewMatrix * vec4(point, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = (1.0 + aSeed * 1.8) * uPixelRatio * (8.0 / max(-viewPosition.z, 1.0));
    vEnergy = influence + 0.18 * sin(phase * 2.0);
  }
`;

const PARTICLE_FRAGMENT = /* glsl */ `
  varying float vEnergy;

  void main() {
    vec2 centered = gl_PointCoord - 0.5;
    float distanceFromCenter = length(centered);
    float alpha = 1.0 - smoothstep(0.16, 0.5, distanceFromCenter);
    vec3 orange = vec3(1.0, 0.31, 0.11);
    vec3 color = mix(orange, vec3(1.0, 0.78, 0.64), clamp(vEnergy, 0.0, 1.0));
    gl_FragColor = vec4(color, alpha * 0.82);
  }
`;

const createParticleData = (count: number) => {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  let randomState = 0x2f6e2b1;
  const random = () => {
    randomState = (1664525 * randomState + 1013904223) >>> 0;
    return randomState / 4294967296;
  };

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    const radius = Math.cbrt(random()) * 2.75;
    const theta = random() * Math.PI * 2;
    const cosine = random() * 2 - 1;
    const sine = Math.sqrt(1 - cosine * cosine);
    positions[offset] = radius * sine * Math.cos(theta);
    positions[offset + 1] = radius * cosine;
    positions[offset + 2] = radius * sine * Math.sin(theta);
    seeds[index] = random();
  }

  return { positions, seeds };
};

const ParticlePiece = () => {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { pointer, viewport } = useThree();
  const particleData = useMemo(() => createParticleData(100_000), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uPixelRatio: { value: 1 },
    }),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uPointer.value.x = THREE.MathUtils.damp(
      material.current.uniforms.uPointer.value.x,
      pointer.x,
      5,
      delta,
    );
    material.current.uniforms.uPointer.value.y = THREE.MathUtils.damp(
      material.current.uniforms.uPointer.value.y,
      pointer.y,
      5,
      delta,
    );
    material.current.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 1.35);
  });

  return (
    <points frustumCulled={false} scale={Math.min(viewport.width / 6.5, 1)}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particleData.positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[particleData.seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={PARTICLE_VERTEX}
        fragmentShader={PARTICLE_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const REACTION_FRAGMENT = /* glsl */ `
  uniform sampler2D uState;
  uniform vec2 uTexel;
  uniform vec2 uBrush;
  uniform float uBrushDown;
  varying vec2 vUv;

  vec2 sampleState(vec2 offset) {
    return texture2D(uState, vUv + offset * uTexel).rg;
  }

  void main() {
    vec2 center = sampleState(vec2(0.0));
    vec2 laplacian = -center;
    laplacian += sampleState(vec2(1.0, 0.0)) * 0.2;
    laplacian += sampleState(vec2(-1.0, 0.0)) * 0.2;
    laplacian += sampleState(vec2(0.0, 1.0)) * 0.2;
    laplacian += sampleState(vec2(0.0, -1.0)) * 0.2;
    laplacian += sampleState(vec2(1.0, 1.0)) * 0.05;
    laplacian += sampleState(vec2(-1.0, 1.0)) * 0.05;
    laplacian += sampleState(vec2(1.0, -1.0)) * 0.05;
    laplacian += sampleState(vec2(-1.0, -1.0)) * 0.05;

    float chemicalA = center.r;
    float chemicalB = center.g;
    float reaction = chemicalA * chemicalB * chemicalB;
    float feed = 0.0367;
    float kill = 0.0649;

    chemicalA += 1.0 * laplacian.r - reaction + feed * (1.0 - chemicalA);
    chemicalB += 0.52 * laplacian.g + reaction - (kill + feed) * chemicalB;

    float brush = 1.0 - smoothstep(0.0, 0.035, distance(vUv, uBrush));
    chemicalB = mix(chemicalB, 0.96, brush * uBrushDown);
    chemicalA = mix(chemicalA, 0.04, brush * uBrushDown);

    gl_FragColor = vec4(clamp(chemicalA, 0.0, 1.0), clamp(chemicalB, 0.0, 1.0), 0.0, 1.0);
  }
`;

const REACTION_DISPLAY_FRAGMENT = /* glsl */ `
  uniform sampler2D uState;
  varying vec2 vUv;

  void main() {
    vec2 chemicals = texture2D(uState, vUv).rg;
    float field = clamp((chemicals.r - chemicals.g) * 1.7, 0.0, 1.0);
    float contour = smoothstep(0.02, 0.18, abs(chemicals.r - chemicals.g - 0.23));
    vec3 black = vec3(0.008, 0.008, 0.009);
    vec3 orange = vec3(1.0, 0.31, 0.11);
    vec3 warm = vec3(1.0, 0.69, 0.48);
    vec3 color = mix(black, orange, 1.0 - field);
    color = mix(warm, color, contour);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const createInitialReactionTexture = (resolution: number) => {
  const data = new Uint8Array(resolution * resolution * 4);

  for (let y = 0; y < resolution; y += 1) {
    for (let x = 0; x < resolution; x += 1) {
      const offset = (y * resolution + x) * 4;
      const normalizedX = x / resolution - 0.5;
      const normalizedY = y / resolution - 0.5;
      const ring = Math.abs(Math.hypot(normalizedX, normalizedY) - 0.18) < 0.025;
      const cross = Math.abs(normalizedX) < 0.018 || Math.abs(normalizedY) < 0.018;
      const seeded = ring || (cross && Math.hypot(normalizedX, normalizedY) < 0.3);
      data[offset] = seeded ? 28 : 255;
      data[offset + 1] = seeded ? 235 : 0;
      data[offset + 2] = 0;
      data[offset + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(
    data,
    resolution,
    resolution,
    THREE.RGBAFormat,
    THREE.UnsignedByteType,
  );
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
};

const ReactionDiffusionPiece = () => {
  const { gl } = useThree();
  const resolution = 256;
  const brush = useRef(new THREE.Vector2(0.5, 0.5));
  const brushDown = useRef(0);
  const currentTexture = useRef<THREE.Texture | null>(null);
  const writeTargetIndex = useRef(0);

  const resources = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const initialTexture = createInitialReactionTexture(resolution);
    const targets = [0, 1].map(
      () =>
        new THREE.WebGLRenderTarget(resolution, resolution, {
          type: THREE.HalfFloatType,
          format: THREE.RGBAFormat,
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          wrapS: THREE.RepeatWrapping,
          wrapT: THREE.RepeatWrapping,
          depthBuffer: false,
          stencilBuffer: false,
        }),
    );
    const simulationMaterial = new THREE.ShaderMaterial({
      vertexShader: FULLSCREEN_VERTEX,
      fragmentShader: REACTION_FRAGMENT,
      uniforms: {
        uState: { value: initialTexture },
        uTexel: { value: new THREE.Vector2(1 / resolution, 1 / resolution) },
        uBrush: { value: brush.current },
        uBrushDown: { value: 0 },
      },
      depthTest: false,
      depthWrite: false,
    });
    const displayMaterial = new THREE.ShaderMaterial({
      vertexShader: FULLSCREEN_VERTEX,
      fragmentShader: REACTION_DISPLAY_FRAGMENT,
      uniforms: { uState: { value: initialTexture } },
      depthTest: false,
      depthWrite: false,
    });
    const camera = new THREE.Camera();
    const simulationScene = new THREE.Scene();
    const displayScene = new THREE.Scene();
    simulationScene.add(new THREE.Mesh(geometry, simulationMaterial));
    displayScene.add(new THREE.Mesh(geometry, displayMaterial));

    return {
      geometry,
      initialTexture,
      targets,
      simulationMaterial,
      displayMaterial,
      camera,
      simulationScene,
      displayScene,
    };
  }, []);

  useEffect(() => {
    currentTexture.current = resources.initialTexture;
    const canvas = gl.domElement;

    const updateBrush = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      brush.current.set(
        (event.clientX - bounds.left) / bounds.width,
        1 - (event.clientY - bounds.top) / bounds.height,
      );
    };
    const startDrawing = (event: PointerEvent) => {
      updateBrush(event);
      brushDown.current = 1;
      canvas.setPointerCapture(event.pointerId);
    };
    const stopDrawing = () => {
      brushDown.current = 0;
    };

    canvas.addEventListener("pointerdown", startDrawing);
    canvas.addEventListener("pointermove", updateBrush);
    canvas.addEventListener("pointerup", stopDrawing);
    canvas.addEventListener("pointercancel", stopDrawing);

    return () => {
      canvas.removeEventListener("pointerdown", startDrawing);
      canvas.removeEventListener("pointermove", updateBrush);
      canvas.removeEventListener("pointerup", stopDrawing);
      canvas.removeEventListener("pointercancel", stopDrawing);
      resources.targets.forEach((target) => target.dispose());
      resources.initialTexture.dispose();
      resources.simulationMaterial.dispose();
      resources.displayMaterial.dispose();
      resources.geometry.dispose();
    };
  }, [gl, resources]);

  useFrame(() => {
    let inputTexture = currentTexture.current ?? resources.initialTexture;
    let targetIndex = writeTargetIndex.current;
    resources.simulationMaterial.uniforms.uBrushDown.value = brushDown.current;

    // Six fixed-cost GPU passes are enough for visible growth while keeping
    // the simulation under budget on integrated desktop GPUs.
    for (let pass = 0; pass < 6; pass += 1) {
      const outputTarget = resources.targets[targetIndex];
      resources.simulationMaterial.uniforms.uState.value = inputTexture;
      gl.setRenderTarget(outputTarget);
      gl.render(resources.simulationScene, resources.camera);
      inputTexture = outputTarget.texture;
      targetIndex = 1 - targetIndex;
    }

    currentTexture.current = inputTexture;
    writeTargetIndex.current = targetIndex;
    resources.displayMaterial.uniforms.uState.value = inputTexture;
    gl.setRenderTarget(null);
    gl.render(resources.displayScene, resources.camera);
  }, 1);

  return null;
};

const LabScene = ({ kind }: { kind: LabSceneKind }) => (
  <Canvas
    aria-hidden="true"
    orthographic={kind !== "particles"}
    camera={kind === "particles" ? { position: [0, 0, 6.2], fov: 44 } : { position: [0, 0, 1] }}
    dpr={[1, 1.35]}
    gl={{
      alpha: false,
      antialias: kind !== "particles",
      powerPreference: "high-performance",
    }}
    onCreated={({ gl }) => {
      gl.outputColorSpace = THREE.SRGBColorSpace;
      gl.setClearColor(0x080808, 1);
    }}
  >
    <CanvasFrameBudget reducedMotion={false} />
    {kind === "raymarch" && <RaymarchPiece />}
    {kind === "particles" && <ParticlePiece />}
    {kind === "reaction" && <ReactionDiffusionPiece />}
  </Canvas>
);

export default LabScene;
