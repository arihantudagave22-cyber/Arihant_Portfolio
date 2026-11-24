import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { Theme } from "../types";

function makeCityHero() {
  const hero = new THREE.Group();
  hero.position.set(0, -0.3, 0);

  const suitRed = new THREE.MeshPhysicalMaterial({
    color: 0xb51f3b,
    roughness: 0.72,
    metalness: 0.08,
    clearcoat: 0.16,
    clearcoatRoughness: 0.58,
  });
  const suitBlue = new THREE.MeshPhysicalMaterial({
    color: 0x182c50,
    roughness: 0.76,
    metalness: 0.12,
    clearcoat: 0.12,
    clearcoatRoughness: 0.62,
  });
  const seamMaterial = new THREE.MeshStandardMaterial({ color: 0x8798b0, roughness: 0.58, metalness: 0.34 });
  const visorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0b1423,
    roughness: 0.26,
    metalness: 0.3,
    clearcoat: 0.85,
  });

  const addMesh = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    position: [number, number, number],
    scale?: [number, number, number],
  ) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    if (scale) mesh.scale.set(...scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    hero.add(mesh);
    return mesh;
  };

  const makeCapsule = (
    radius: number,
    length: number,
    material: THREE.Material,
    position: [number, number, number],
    scale?: [number, number, number],
  ) => addMesh(new THREE.CapsuleGeometry(radius, length, 8, 18), material, position, scale);

  const torso = makeCapsule(0.34, 0.62, suitRed, [0, 0.12, 0]);
  torso.scale.set(1.05, 1, 0.78);
  makeCapsule(0.29, 0.27, suitBlue, [0, -0.62, 0], [1.12, 1, 0.82]);
  makeCapsule(0.13, 0.2, suitBlue, [0, 0.72, 0]);

  const chestPanel = addMesh(new THREE.SphereGeometry(0.34, 32, 24), suitRed, [0, 0.34, 0.21], [0.92, 0.77, 0.48]);
  chestPanel.rotation.x = -0.08;
  addMesh(new THREE.SphereGeometry(0.31, 32, 24), suitRed, [0, 1.06, 0.02], [0.84, 1.05, 0.82]);
  addMesh(new THREE.SphereGeometry(0.22, 24, 16), visorMaterial, [0, 1.1, 0.25], [1.2, 0.27, 0.55]);

  for (const side of [-1, 1]) {
    const shoulder = addMesh(new THREE.SphereGeometry(0.2, 24, 16), suitRed, [side * 0.38, 0.51, 0], [1.08, 0.94, 0.9]);
    shoulder.rotation.z = side * -0.12;

    const upperArm = makeCapsule(0.12, 0.39, suitBlue, [side * 0.47, 0.16, 0]);
    upperArm.rotation.z = side * -0.09;
    const elbow = addMesh(new THREE.SphereGeometry(0.125, 20, 14), seamMaterial, [side * 0.49, -0.12, 0.01]);
    elbow.scale.set(0.95, 0.84, 0.86);
    const forearm = makeCapsule(0.125, 0.43, suitRed, [side * 0.5, -0.4, 0]);
    forearm.rotation.z = side * 0.05;
    makeCapsule(0.115, 0.13, suitBlue, [side * 0.51, -0.7, 0.02], [1, 1, 0.95]);

    const thigh = makeCapsule(0.15, 0.38, suitBlue, [side * 0.19, -0.93, 0]);
    thigh.rotation.z = side * -0.025;
    addMesh(new THREE.SphereGeometry(0.145, 20, 14), suitRed, [side * 0.2, -1.19, 0.02], [1, 0.9, 0.88]);
    const shin = makeCapsule(0.125, 0.45, suitBlue, [side * 0.2, -1.47, 0]);
    shin.rotation.z = side * 0.025;
    makeCapsule(0.13, 0.12, suitRed, [side * 0.2, -1.75, 0.11], [1, 0.8, 1.25]);
  }

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.045, 10, 32), seamMaterial);
  collar.position.set(0, 0.73, 0);
  collar.rotation.x = Math.PI / 2;
  hero.add(collar);

  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.025, 8, 32), seamMaterial);
  belt.position.set(0, -0.62, 0);
  belt.rotation.x = Math.PI / 2;
  belt.scale.set(1.05, 0.8, 1);
  hero.add(belt);

  const platform = new THREE.Mesh(
    new THREE.TorusGeometry(0.7, 0.012, 8, 64),
    new THREE.MeshBasicMaterial({ color: 0x3978e3, transparent: true, opacity: 0.5 }),
  );
  platform.rotation.x = Math.PI / 2;
  platform.position.y = -1.88;
  hero.add(platform);

  return hero;
}

function makeMotionTrail(color: number, points: THREE.Vector3[]) {
  const path = new THREE.CatmullRomCurve3(points);
  return new THREE.Mesh(
    new THREE.TubeGeometry(path, 64, 0.012, 6, false),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 }),
  );
}

export default function ThreeHeroScene({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const lightsRef = useRef<{
    hemisphere: THREE.HemisphereLight;
    key: THREE.DirectionalLight;
    red: THREE.PointLight;
    blue: THREE.PointLight;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
    camera.position.set(0, 0.04, 8.6);

    const hemisphere = new THREE.HemisphereLight(0xe9f3ff, 0x101827, 1.9);
    scene.add(hemisphere);
    const keyLight = new THREE.DirectionalLight(0xffe6dd, 3.4);
    keyLight.position.set(-3.4, 4.8, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x5588dd, 2.8);
    rimLight.position.set(3.2, 1.6, -3);
    scene.add(rimLight);
    const redFill = new THREE.PointLight(0xd6284b, 16, 6);
    redFill.position.set(-2.2, 1.1, 2);
    scene.add(redFill);
    const blueFill = new THREE.PointLight(0x3978e3, 22, 7);
    blueFill.position.set(2.4, 0.5, 2.1);
    scene.add(blueFill);

    const cityHero = makeCityHero();
    cityHero.scale.setScalar(1.08);
    scene.add(cityHero);

    const blueTrail = makeMotionTrail(0x5ca0ff, [
      new THREE.Vector3(-1.75, -0.7, -0.5),
      new THREE.Vector3(-1.35, 0.3, -0.6),
      new THREE.Vector3(-0.2, 1.5, -0.7),
    ]);
    const redTrail = makeMotionTrail(0xf04a68, [
      new THREE.Vector3(1.8, -0.9, -0.55),
      new THREE.Vector3(1.42, 0.2, -0.65),
      new THREE.Vector3(0.65, 1.25, -0.75),
    ]);
    scene.add(blueTrail, redTrail);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    lightsRef.current = { hemisphere, key: keyLight, red: redFill, blue: blueFill };

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      lightsRef.current = null;
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const lights = lightsRef.current;
    if (!renderer || !scene || !camera || !lights) return;

    const lightMode = theme === "light";
    lights.hemisphere.intensity = lightMode ? 2.4 : 1.9;
    lights.key.intensity = lightMode ? 3.8 : 3.4;
    lights.red.intensity = lightMode ? 10 : 16;
    lights.blue.intensity = lightMode ? 14 : 22;
    renderer.render(scene, camera);
  }, [theme]);

  return (
    <div aria-label="Stationary original 3D city guardian" className="three-scene" role="img">
      <canvas aria-hidden="true" className="three-scene__canvas" ref={canvasRef} />
      <span className="three-scene__tag three-scene__tag--city">CITY / 01</span>
      <span className="three-scene__name three-scene__name--city">THE CITY RUNNER</span>
      <span aria-hidden="true" className="three-scene__spark three-scene__spark--one" />
      <span aria-hidden="true" className="three-scene__spark three-scene__spark--two" />
      <span aria-hidden="true" className="three-scene__spark three-scene__spark--three" />
    </div>
  );
}
