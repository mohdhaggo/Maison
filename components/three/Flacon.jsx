"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A parametric luxury perfume flacon, built entirely in code (no model file).
 * Performance note: the glass uses single-pass `meshPhysicalMaterial`
 * transmission (not drei's multi-sample MeshTransmissionMaterial) so it stays
 * smooth on integrated GPUs while still reading as real glass.
 */
function useFlaconGeometry() {
  return useMemo(() => {
    const glass = new THREE.LatheGeometry(
      [
        [0.0, 0.0],
        [0.62, 0.0],
        [0.97, 0.06],
        [1.0, 0.35],
        [1.0, 1.35],
        [0.94, 1.55],
        [0.62, 1.72],
        [0.34, 1.82],
        [0.3, 1.98],
        [0.3, 2.18],
        [0.0, 2.18],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
      48
    );
    glass.computeVertexNormals();

    const liquid = new THREE.LatheGeometry(
      [
        [0.0, 0.06],
        [0.88, 0.08],
        [0.9, 0.35],
        [0.9, 1.18],
        [0.7, 1.28],
        [0.0, 1.32],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
      48
    );
    liquid.computeVertexNormals();

    return { glass, liquid };
  }, []);
}

export default function Flacon({ color = "#d4af65", color2 = "#f2e2bd", spin = 0.3 }) {
  const group = useRef();
  const { glass, liquid } = useFlaconGeometry();

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    // clamp delta so a stutter doesn't make the bottle jump
    const d = Math.min(delta, 0.05);
    g.rotation.y += d * spin;
    const { x, y } = state.pointer;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -y * 0.2, 0.06);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, x * 0.07, 0.06);
  });

  return (
    <group ref={group}>
      <group position={[0, -1.1, 0]}>
        {/* GLASS — single-pass physical transmission */}
        <mesh geometry={glass}>
          <meshPhysicalMaterial
            transmission={0.92}
            thickness={1.2}
            roughness={0.08}
            metalness={0}
            ior={1.45}
            clearcoat={1}
            clearcoatRoughness={0.18}
            attenuationColor={color}
            attenuationDistance={1.6}
            color="#ffffff"
            envMapIntensity={1.3}
          />
        </mesh>

        {/* LIQUID — cheap opaque emissive fill */}
        <mesh geometry={liquid}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.35}
            roughness={0.25}
            metalness={0}
          />
        </mesh>

        {/* CAP */}
        <group position={[0, 2.42, 0]}>
          <mesh>
            <cylinderGeometry args={[0.36, 0.36, 0.52, 48]} />
            <meshStandardMaterial color="#caa44e" metalness={1} roughness={0.22} />
          </mesh>
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.31, 0.31, 0.07, 48]} />
            <meshStandardMaterial color={color2} metalness={0.95} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.12, 24, 24]} />
            <meshStandardMaterial color={color2} metalness={1} roughness={0.15} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
