"use client";
import { useEffect, useRef } from "react";
import type { Material, Object3D, MeshStandardMaterial } from "three";

export default function ThreeHero() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const cleanups: (() => void)[] = [];
    let raf = 0;

    (async () => {
      const THREE = await import("three");
      const { FontLoader } = await import("three/examples/jsm/loaders/FontLoader.js");
      const { TextGeometry } = await import("three/examples/jsm/geometries/TextGeometry.js");

      /* ── RENDERER ── */
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.4;
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      mount.appendChild(renderer.domElement);
      cleanups.push(() => {
        renderer.dispose();
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      });

      /* ── SCENE ── */
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x050507);
      scene.fog = new THREE.Fog(0x050507, 18, 42);

      /* ── CAMERA ── */
      const cam = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100);
      cam.position.set(0, 0.8, 7.5);
      cam.lookAt(0, 0, 0);

      const onResize = () => {
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        cam.aspect = mount.clientWidth / mount.clientHeight;
        cam.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);
      cleanups.push(() => window.removeEventListener("resize", onResize));

      /* ── LIGHTS ── */
      scene.add(new THREE.AmbientLight(0x060616, 5));

      const oLight = new THREE.PointLight(0xf5a623, 9, 28);
      oLight.position.set(3, 3, 5);
      scene.add(oLight);

      const tLight = new THREE.PointLight(0x00c9b8, 5, 22);
      tLight.position.set(-5, -2, 2);
      scene.add(tLight);

      const fLight = new THREE.PointLight(0xff6b35, 3, 16);
      fLight.position.set(-1, 5, 0);
      scene.add(fLight);

      /* ── REUSABLE FACTORIES ── */
      const wireMat = new THREE.LineBasicMaterial({ color: 0xf5a623, transparent: true, opacity: 0.52 });

      function addBox(
        w: number, h: number, d: number,
        x: number, y: number, z: number,
        mat: Material,
        parent: Object3D,
        rz = 0,
      ) {
        const geo = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        mesh.rotation.z = rz;
        parent.add(mesh);
        const ln = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 10), wireMat);
        ln.position.copy(mesh.position);
        ln.rotation.copy(mesh.rotation);
        parent.add(ln);
      }

      function addSphere(
        r: number, x: number, y: number, z: number,
        mat: Material,
        parent: Object3D,
      ) {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), mat);
        mesh.position.set(x, y, z);
        parent.add(mesh);
      }

      function addCyl(
        rt: number, rb: number, h: number,
        x: number, y: number, z: number,
        mat: Material,
        parent: Object3D,
      ) {
        const geo = new THREE.CylinderGeometry(rt, rb, h, 16);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        parent.add(mesh);
        const ln = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), wireMat);
        ln.position.copy(mesh.position);
        parent.add(ln);
      }

      /* ── MATERIALS ── */
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x0c0c11, emissive: 0xf5a623, emissiveIntensity: 0.05,
        metalness: 0.78, roughness: 0.20,
      });

      const glow = (hex: number, ei = 0.9): MeshStandardMaterial => new THREE.MeshStandardMaterial({
        color: new THREE.Color(hex).multiplyScalar(0.12),
        emissive: hex, emissiveIntensity: ei,
        metalness: 0.2, roughness: 0.55,
      });

      /* ── CONTROLLER ── */
      const ctrl = new THREE.Group();
      ctrl.position.set(1.5, 0, 0);

      // Bridge
      addBox(2.7, 0.62, 0.30, 0, 0.32, 0, bodyMat, ctrl);

      // Left grip
      const lg = new THREE.Group();
      lg.position.set(-0.92, -0.50, 0);
      lg.rotation.z = 0.17;
      addBox(0.90, 1.55, 0.37, 0, 0, 0, bodyMat, lg);
      ctrl.add(lg);

      // Right grip
      const rg = new THREE.Group();
      rg.position.set(0.92, -0.50, 0);
      rg.rotation.z = -0.17;
      addBox(0.90, 1.55, 0.37, 0, 0, 0, bodyMat, rg);
      ctrl.add(rg);

      // D-pad (horizontal + vertical)
      addBox(0.50, 0.15, 0.09, -0.70, 0.50, 0.19, glow(0xf5a623, 0.4), ctrl);
      addBox(0.15, 0.50, 0.09, -0.70, 0.50, 0.19, glow(0xf5a623, 0.4), ctrl);

      // Face buttons — diamond pattern
      addSphere(0.105, 0.64, 0.56, 0.19, glow(0x8b5cf6), ctrl); // Y top
      addSphere(0.105, 0.80, 0.40, 0.19, glow(0xf5a623), ctrl); // B right
      addSphere(0.105, 0.48, 0.40, 0.19, glow(0x00c9b8), ctrl); // X left
      addSphere(0.105, 0.64, 0.24, 0.19, glow(0xffe040), ctrl); // A bottom

      // Joystick bases + caps
      addCyl(0.16, 0.19, 0.08, -0.26, 0.30, 0.18, bodyMat, ctrl);
      addSphere(0.13, -0.26, 0.37, 0.20, glow(0xf5a623, 0.1), ctrl);
      addCyl(0.16, 0.19, 0.08, 0.28, 0.07, 0.18, bodyMat, ctrl);
      addSphere(0.13, 0.28, 0.14, 0.20, glow(0xf5a623, 0.1), ctrl);

      // Guide button (orange glow center)
      addSphere(0.092, 0, 0.38, 0.20, glow(0xf5a623, 1.5), ctrl);

      // Shoulder bumpers
      addBox(0.68, 0.13, 0.16, -0.70, 0.66, 0, bodyMat, ctrl);
      addBox(0.68, 0.13, 0.16, 0.70, 0.66, 0, bodyMat, ctrl);

      scene.add(ctrl);

      /* ── PARTICLES ── */
      const ptN = 550;
      const ptPos = new Float32Array(ptN * 3);
      const ptClr = new Float32Array(ptN * 3);
      const pal = [
        new THREE.Color(0xf5a623), new THREE.Color(0xff6b35),
        new THREE.Color(0x00c9b8), new THREE.Color(0x8b5cf6),
      ];
      for (let i = 0; i < ptN; i++) {
        ptPos[i * 3]     = (Math.random() - 0.5) * 24;
        ptPos[i * 3 + 1] = (Math.random() - 0.5) * 15;
        ptPos[i * 3 + 2] = -3 - Math.random() * 14;
        const c = pal[Math.floor(Math.random() * pal.length)];
        ptClr[i * 3] = c.r; ptClr[i * 3 + 1] = c.g; ptClr[i * 3 + 2] = c.b;
      }
      const ptGeo = new THREE.BufferGeometry();
      ptGeo.setAttribute("position", new THREE.BufferAttribute(ptPos, 3));
      ptGeo.setAttribute("color",    new THREE.BufferAttribute(ptClr, 3));
      scene.add(new THREE.Points(ptGeo, new THREE.PointsMaterial({
        size: 0.038, vertexColors: true, transparent: true, opacity: 0.70, sizeAttenuation: true,
      })));

      /* ── GRID FLOOR ── */
      const grid = new THREE.GridHelper(40, 40, 0xf5a623, 0x130c02);
      grid.position.y = -3.8;
      (grid.material as Material).transparent = true;
      (grid.material as Material).opacity = 0.10;
      scene.add(grid);

      /* ── 3D TEXT (non-blocking, appended when ready) ── */
      let synthGroup:  import("three").Group | null = null;
      let studioGroup: import("three").Group | null = null;

      fetch("/fonts/helvetiker_bold.typeface.json")
        .then(r => r.json())
        .then(json => {
          const font = new FontLoader().parse(json);

          const tMat = new THREE.MeshStandardMaterial({
            color: 0x060303, emissive: 0xf5a623, emissiveIntensity: 0.32,
            metalness: 0.88, roughness: 0.14, transparent: true, opacity: 0.80,
          });
          const twMat = new THREE.LineBasicMaterial({
            color: 0xf5a623, transparent: true, opacity: 0.14,
          });

          const mkText = (str: string, sz: number) => {
            const geo = new TextGeometry(str, {
              font, size: sz, depth: sz * 0.24, curveSegments: 5,
              bevelEnabled: true,
              bevelThickness: sz * 0.022, bevelSize: sz * 0.013,
              bevelSegments: 2,
            });
            geo.computeBoundingBox();
            const w = geo.boundingBox!.max.x - geo.boundingBox!.min.x;
            const g = new THREE.Group();
            g.add(new THREE.Mesh(geo, tMat));
            g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 14), twMat));
            return { group: g, width: w };
          };

          const { group: sg, width: sw } = mkText("SYNTHRIX", 0.82);
          sg.position.set(-sw / 2, 1.05, -1.8);
          sg.rotation.x = -0.08;
          scene.add(sg);
          synthGroup = sg;

          const { group: dg, width: dw } = mkText("STUDIO", 0.40);
          dg.position.set(-dw / 2, 0.10, -1.4);
          dg.rotation.x = -0.08;
          scene.add(dg);
          studioGroup = dg;
        })
        .catch(() => { /* text decorative — safe to skip */ });

      /* ── MOUSE ── */
      let mx = 0, my = 0;
      const onMouse = (e: MouseEvent) => {
        mx = (e.clientX / innerWidth) * 2 - 1;
        my = -(e.clientY / innerHeight) * 2 + 1;
      };
      window.addEventListener("mousemove", onMouse);
      cleanups.push(() => window.removeEventListener("mousemove", onMouse));

      /* ── ANIMATE ── */
      const clock = new THREE.Clock();
      const tick = () => {
        raf = requestAnimationFrame(tick);
        const t = clock.getElapsedTime();

        // Controller float + tilt with mouse
        ctrl.position.y  = Math.sin(t * 0.68) * 0.13;
        ctrl.rotation.y  = Math.sin(t * 0.33) * 0.22 + mx * 0.14;
        ctrl.rotation.x  = -0.06 + Math.sin(t * 0.22) * 0.05 - my * 0.06;

        // Text subtle levitation
        if (synthGroup)  synthGroup.position.y  = 1.05 + Math.sin(t * 0.38 + 1.2) * 0.06;
        if (studioGroup) studioGroup.position.y = 0.10 + Math.sin(t * 0.38 + 1.0) * 0.04;

        // Smooth camera drift
        cam.position.x += (mx * 0.45 - cam.position.x) * 0.04;
        cam.position.y += (0.8 + my * 0.28 - cam.position.y) * 0.04;
        cam.lookAt(0, 0.3, 0);

        // Orange light breathe
        oLight.intensity = 9 + Math.sin(t * 1.3) * 2;

        renderer.render(scene, cam);
      };
      tick();
      cleanups.push(() => cancelAnimationFrame(raf));
    })().catch(console.error);

    return () => cleanups.forEach(fn => fn());
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
    />
  );
}
