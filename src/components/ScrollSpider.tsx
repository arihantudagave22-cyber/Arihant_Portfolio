import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { getScrollMotion, getSpiderFacingAngle } from "../utils/scrollMotion";
import { makeHairpinScrollPath } from "../utils/scrollPath";

function addLegSegment(parent: THREE.Group, material: THREE.Material, start: THREE.Vector3, end: THREE.Vector3, radius: number) {
  const direction = end.clone().sub(start);
  const segment = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.7, radius, direction.length(), 8),
    material,
  );
  segment.position.copy(start).add(end).multiplyScalar(0.5);
  segment.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  parent.add(segment);
  return segment;
}

function makeScoutSpider() {
  const spider = new THREE.Group();
  const shell = new THREE.MeshPhysicalMaterial({
    color: 0x182c50,
    roughness: 0.44,
    metalness: 0.42,
    clearcoat: 0.8,
  });
  const redShell = new THREE.MeshPhysicalMaterial({
    color: 0xc52c48,
    roughness: 0.38,
    metalness: 0.32,
    clearcoat: 0.75,
  });
  const joints = new THREE.MeshStandardMaterial({ color: 0x8097ba, metalness: 0.65, roughness: 0.3 });
  const glow = new THREE.MeshBasicMaterial({ color: 0x78baff });

  const abdomen = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 18), shell);
  abdomen.position.y = -0.06;
  abdomen.scale.set(0.9, 1.05, 0.78);
  spider.add(abdomen);

  const thorax = new THREE.Mesh(new THREE.SphereGeometry(0.135, 20, 16), redShell);
  thorax.position.set(0, 0.14, 0.025);
  spider.add(thorax);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 20, 16), shell);
  head.position.set(0, 0.29, 0.035);
  spider.add(head);

  for (const side of [-1, 1]) {
    const sensor = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 10), glow);
    sensor.position.set(side * 0.055, 0.31, 0.125);
    spider.add(sensor);
  }

  const legs: Array<{ group: THREE.Group; lowerLeg: THREE.Group; side: number; index: number }> = [];
  const shoulderYs = [0.16, 0.06, -0.05, -0.15];
  for (let index = 0; index < shoulderYs.length; index += 1) {
    for (const side of [-1, 1]) {
      const leg = new THREE.Group();
      const shoulder = new THREE.Vector3(side * 0.105, shoulderYs[index], 0);
      const knee = new THREE.Vector3(side * (0.28 + index * 0.015), shoulderYs[index] + (index < 2 ? 0.1 : -0.08), 0.015);
      const tip = new THREE.Vector3(side * (0.43 + index * 0.02), shoulderYs[index] + (index < 2 ? 0.03 : -0.15), 0.06);
      leg.position.copy(shoulder);
      const kneePosition = knee.clone().sub(shoulder);
      addLegSegment(leg, shell, new THREE.Vector3(), kneePosition, 0.034);

      const lowerLeg = new THREE.Group();
      lowerLeg.position.copy(kneePosition);
      addLegSegment(lowerLeg, redShell, new THREE.Vector3(), tip.clone().sub(knee), 0.024);

      const joint = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), joints);
      joint.position.copy(kneePosition);
      leg.add(joint);
      leg.add(lowerLeg);
      spider.add(leg);
      legs.push({ group: leg, lowerLeg, side, index });
    }
  }

  return { spider, legs };
}

export default function ScrollSpider() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(88, 88, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 20);
    camera.position.set(0, 0.03, 2.45);
    scene.add(new THREE.HemisphereLight(0xe5f1ff, 0x101827, 2.1));

    const keyLight = new THREE.DirectionalLight(0xffe6dc, 2.6);
    keyLight.position.set(-2, 3, 4);
    scene.add(keyLight);

    const blueRim = new THREE.PointLight(0x5796ff, 7, 4);
    blueRim.position.set(1, 0.4, -1.2);
    scene.add(blueRim);

    const redLight = new THREE.PointLight(0xd52a49, 5, 3);
    redLight.position.set(-0.9, 0.5, 1.2);
    scene.add(redLight);

    const { spider, legs } = makeScoutSpider();
    scene.add(spider);

    const spiderSize = 88;
    let path = makeHairpinScrollPath(window.innerWidth, window.innerHeight, spiderSize);
    let pathLength = path.getLength();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let targetProgress = 0;
    let currentProgress = 0;
    let targetLean = 0;
    let currentLean = 0;
    let scrollDirection = 1;
    let previousScrollY = window.scrollY;
    let previousScrollTime = performance.now();
    let animationFrame = 0;

    const updateTarget = () => {
      if (reducedMotion) {
        targetProgress = 0;
        targetLean = 0;
        return;
      }

      const now = performance.now();
      const elapsed = Math.max(now - previousScrollTime, 1);
      const scrollY = window.scrollY;
      const scrollDelta = scrollY - previousScrollY;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      targetProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      targetLean = getScrollMotion(scrollDelta, elapsed);
      if (scrollDelta !== 0) scrollDirection = scrollDelta < 0 ? -1 : 1;
      previousScrollY = scrollY;
      previousScrollTime = now;
    };

    const animate = () => {
      currentProgress = targetProgress;
      currentLean = targetLean;
      const position = path.getPointAt(currentProgress);
      const tangent = path.getTangentAt(currentProgress);
      container.style.transform = `translate3d(${(position.x - spiderSize / 2).toFixed(2)}px, ${(position.y - spiderSize / 2).toFixed(2)}px, 0)`;
      spider.rotation.z = getSpiderFacingAngle(tangent.x, tangent.y, scrollDirection) - currentLean * 0.28;
      const gaitPhase = currentProgress * pathLength / 320 * Math.PI * 2;
      spider.position.y = Math.abs(Math.sin(gaitPhase)) * 0.035;
      legs.forEach(({ group, lowerLeg, side, index }) => {
        const legPhase = gaitPhase + index * Math.PI / 2 + (side < 0 ? Math.PI : 0);
        group.rotation.z = Math.sin(legPhase) * 0.24 + currentLean * side * 0.1;
        lowerLeg.rotation.z = Math.sin(legPhase + 0.9) * 0.28;
      });
      renderer.render(scene, camera);

      if (Math.abs(targetProgress - currentProgress) > 0.0005 || Math.abs(targetLean - currentLean) > 0.01) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        animationFrame = 0;
      }
    };

    const onScroll = () => {
      updateTarget();
      if (!reducedMotion && !animationFrame) animationFrame = window.requestAnimationFrame(animate);
    };
    const onResize = () => {
      path = makeHairpinScrollPath(window.innerWidth, window.innerHeight, spiderSize);
      pathLength = path.getLength();
      onScroll();
    };

    updateTarget();
    currentProgress = targetProgress;
    const initialPosition = path.getPointAt(currentProgress);
    container.style.transform = `translate3d(${(initialPosition.x - spiderSize / 2).toFixed(2)}px, ${(initialPosition.y - spiderSize / 2).toFixed(2)}px, 0)`;
    renderer.render(scene, camera);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(animationFrame);
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      renderer.dispose();
    };
  }, [portalRoot]);

  return portalRoot
    ? createPortal(
        <div aria-hidden="true" className="scroll-spider" ref={containerRef}>
          <canvas className="scroll-spider__canvas" ref={canvasRef} />
        </div>,
        portalRoot,
      )
    : null;
}
