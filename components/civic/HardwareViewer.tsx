"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { PartId } from "./CivicHome";
import styles from "./CivicHome.module.css";
type Props = { selected: PartId; exploded: boolean };
export default function HardwareViewer({ selected, exploded }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const model = useRef<THREE.Group>();
  const draw = useRef<() => void>(() => {});
  const state = useRef({ selected, exploded });
  state.current = { selected, exploded };
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const root = host.current!;
    let disposed = false;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setStatus("error");
      return;
    }
    const css = getComputedStyle(root);
    const ink = css.getPropertyValue("--b-ink").trim(),
      blue = css.getPropertyValue("--b-accent").trim();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    root.appendChild(renderer.domElement);
    renderer.domElement.setAttribute(
      "aria-label",
      "Interactive Lane Counter CAD model. Drag or use arrow keys to rotate; use the component buttons to highlight parts.",
    );
    const scene = new THREE.Scene();
    scene.add(
      new THREE.HemisphereLight(
        css.getPropertyValue("--b-surface").trim(),
        css.getPropertyValue("--b-muted").trim(),
        3,
      ),
    );
    const light = new THREE.DirectionalLight(
      css.getPropertyValue("--b-surface").trim(),
      4,
    );
    light.position.set(2, -3, 4);
    scene.add(light);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.001, 10);
    camera.up.set(0, 0, 1);
    camera.position.set(0.32, -0.42, 0.3);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.touches.ONE = THREE.TOUCH.ROTATE;
    controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.tabIndex = 0;
    const onKey = (event: KeyboardEvent) => {
      if (
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      )
        return;
      event.preventDefault();
      const offset = camera.position.clone().sub(controls.target);
      const sphere = new THREE.Spherical().setFromVector3(offset);
      sphere.theta +=
        event.key === "ArrowLeft"
          ? 0.15
          : event.key === "ArrowRight"
            ? -0.15
            : 0;
      sphere.phi +=
        event.key === "ArrowUp" ? -0.15 : event.key === "ArrowDown" ? 0.15 : 0;
      sphere.makeSafe();
      camera.position
        .copy(controls.target)
        .add(new THREE.Vector3().setFromSpherical(sphere));
      controls.update();
    };
    renderer.domElement.addEventListener("keydown", onKey);
    const render = () => {
      if (!disposed) renderer.render(scene, camera);
    };
    const fit = () => {
      if (!model.current) return;
      const sphere = new THREE.Box3()
        .setFromObject(model.current)
        .getBoundingSphere(new THREE.Sphere());
      const direction = camera.position
        .clone()
        .sub(controls.target)
        .normalize();
      const fov =
        2 *
        Math.atan(
          Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
            Math.min(camera.aspect, 1),
        );
      const distance = (sphere.radius / Math.sin(fov / 2)) * 1.12;
      controls.target.copy(sphere.center);
      camera.position.copy(sphere.center).addScaledVector(direction, distance);
      controls.update();
    };
    const update = () => {
      model.current?.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        const p = obj.name as PartId;
        const mat = obj.material as THREE.MeshStandardMaterial;
        mat.color.set(p === state.current.selected ? blue : ink);
        const original = obj.userData.original as THREE.Vector3;
        obj.position.copy(original);
        if (state.current.exploded) {
          if (p === "cover") obj.position.y += 0.09;
          if (p === "sled") obj.position.z += 0.06;
          if (p === "head") obj.position.z += 0.14;
          if (p === "bracket") obj.position.z -= 0.06;
        }
      });
      fit();
      render();
    };
    draw.current = update;
    controls.addEventListener("change", render);
    const resize = () => {
      const { width, height } = root.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      fit();
      render();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    const fail = () => {
      if (!disposed) setStatus("error");
    };
    renderer.domElement.addEventListener("webglcontextlost", fail);
    new GLTFLoader().load(
      "/hardware/lane-counter-v07.glb",
      (gltf) => {
        if (disposed) {
          gltf.scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              obj.geometry.dispose();
              const mats = Array.isArray(obj.material)
                ? obj.material
                : [obj.material];
              mats.forEach((m) => m.dispose());
            }
          });
          return;
        }
        model.current = gltf.scene;
        gltf.scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            const old = Array.isArray(obj.material)
              ? obj.material
              : [obj.material];
            old.forEach((m) => m.dispose());
            obj.material = new THREE.MeshStandardMaterial({
              color: ink,
              roughness: 0.7,
              metalness: 0.15,
            });
            obj.userData.original = obj.position.clone();
          }
        });
        scene.add(gltf.scene);
        resize();
        update();
        setStatus("ready");
      },
      undefined,
      fail,
    );
    resize();
    return () => {
      disposed = true;
      draw.current = () => {};
      observer.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("keydown", onKey);
      renderer.domElement.removeEventListener("webglcontextlost", fail);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const materials = Array.isArray(obj.material)
            ? obj.material
            : [obj.material];
          materials.forEach((m) => m.dispose());
        }
      });
      model.current = undefined;
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [attempt]);
  useEffect(() => {
    draw.current();
  }, [selected, exploded]);
  return (
    <div
      ref={host}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {status !== "ready" ? (
        <div
          className={styles.modelLoading}
          style={{ position: "absolute", inset: 0, zIndex: 1 }}
          role="status"
        >
          {status === "loading" ? (
            "Loading the hardware view…"
          ) : (
            <div>
              <p>The 3D view could not load.</p>
              <button
                className="b-btn b-btn-secondary"
                onClick={() => {
                  setStatus("loading");
                  setAttempt((n) => n + 1);
                }}
              >
                Retry 3D view
              </button>
              <p>
                <a href="/hardware/lane-counter-v07-assembly.svg">
                  Open the engineering drawing ↗
                </a>
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
