"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * A parametric luxury perfume flacon, built entirely in code (no model file).
 * The glass body uses a lathed silhouette + transmission material; the liquid
 * inside is tinted with the perfume's accent colour so every bottle is unique.
 */
function useFlaconGeometry() {
  return useMemo(() => {
    // Glass body silhouette — x = radius, y = height (bottom → top)
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
      96
    );
    glass.computeVertexNormals();

    // Liquid — same shape, slightly smaller, filled to ~70%
    const liquid = new THREE.LatheGeometry(
      [
        [0.0, 0.06],
        [0.88, 0.08],
        [0.9, 0.35],
        [0.9, 1.18],
        [0.7, 1.28],
        [0.0, 1.32],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
      96
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
    // gentle auto-rotation
    g.rotation.y += delta * spin;
    // pointer parallax — bottle leans toward the cursor
    const { x, y } = state.pointer;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -y * 0.22, 0.06);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, x * 0.08, 0.06);
  });

  return (
    <group ref={group}>
      {/* centre the bottle on the origin so it spins about its middle */}
      <group position={[0, -1.1, 0]}>
        {/* GLASS */}
        <mesh geometry={glass}>
          <MeshTransmissionMaterial
            transmission={1}
            thickness={0.7}
            roughness={0.05}
            ior={1.46}
            chromaticAberration={0.06}
            anisotropy={0.4}
            distortion={0.15}
            distortionScale={0.3}
            temporalDistortion={0.08}
            attenuationColor={color}
            attenuationDistance={1.4}
            color="#ffffff"
            backside
            samples={6}
            resolution={256}
          />
        </mesh>

        {/* LIQUID */}
        <mesh geometry={liquid}>
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.28}
            transmission={0.55}
            thickness={2}
            roughness={0.18}
            ior={1.34}
            attenuationColor={color}
            attenuationDistance={0.5}
            clearcoat={1}
            clearcoatRoughness={0.2}
          />
        </mesh>

        {/* CAP */}
        <group position={[0, 2.42, 0]}>
          <mesh>
            <cylinderGeometry args={[0.36, 0.36, 0.52, 72]} />
            <meshStandardMaterial color="#caa44e" metalness={1} roughness={0.22} />
          </mesh>
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.31, 0.31, 0.07, 72]} />
            <meshStandardMaterial color={color2} metalness={0.95} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial color={color2} metalness={1} roughness={0.15} />
          </mesh>
        </group>

        {/* engraved-look label ring */}
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[1.01, 1.01, 0.5, 96, 1, true]} />
          <meshStandardMaterial
            color={color}
            metalness={0.2}
            roughness={0.6}
            transparent
            opacity={0.16}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
