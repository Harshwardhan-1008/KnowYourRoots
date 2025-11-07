"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

type Point = { key: string; surname: string; lat: number; lng: number; region?: string };

// --- Utility: Convert latitude/longitude → 3D position on sphere ---
function latLngToCartesian(lat: number, lng: number, radius = 2) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// --- Globe Component ---
function Globe({ textureUrl }: { textureUrl?: string }) {
  const earthTexture = useTexture(textureUrl || "/earth.jpg");

  // Apply advanced texture filters for clarity
  if (earthTexture) {
    earthTexture.anisotropy = 16;
    earthTexture.minFilter = THREE.LinearMipmapLinearFilter;
    earthTexture.magFilter = THREE.LinearFilter;
  }

  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={earthTexture}
        metalness={0.1}
        roughness={0.8}
        emissiveIntensity={0.2}
        toneMapped={true}
      />
    </mesh>
  );
}

// --- Rotating group for auto rotation ---
function RotatingGroup({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<THREE.Group | null>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.08;
  });
  return <group ref={ref}>{children}</group>;
}

// --- Marker (surname origin point) ---
function PointMarker({ point, onHover }: { point: Point; onHover: (p: Point | null) => void }) {
  const pos = useMemo(() => latLngToCartesian(point.lat, point.lng, 2.02), [point]);
  const ref = React.useRef<THREE.Mesh | null>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.scale.setScalar(1 + 0.12 * Math.sin(t * 3));
    }
  });

  return (
    <mesh
      ref={ref}
      position={pos}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(point);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
    >
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial color="#ffcc00" emissive="#ff9900" emissiveIntensity={0.4} />
    </mesh>
  );
}

// --- Layer containing all points ---
function PointsLayer({ points, onHover }: { points: Point[]; onHover: (p: Point | null) => void }) {
  return (
    <group>
      {points.map((pt) => (
        <PointMarker key={pt.key} point={pt} onHover={onHover} />
      ))}
    </group>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function VisualizePage() {
  const [points, setPoints] = useState<Point[]>([]);
  const [hovered, setHovered] = useState<Point | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/surnames/coords");
        const json = await res.json();
        if (json?.success) setPoints(json.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#333333]">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="font-serif text-4xl text-[#800000] mb-3">Global Surname Origins 🌍</h1>
        <p className="text-sm text-[#C8A951] mb-6">
          Visualize the ancestral roots of surnames across the globe. Hover points to see details.
        </p>

        <div className="w-full h-[640px] rounded-xl overflow-hidden bg-white shadow-md border border-[#C8A951]">
          <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
            {/* Lights */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#88aaff" />

            {/* Scene */}
            <Suspense fallback={null}>
              <RotatingGroup>
                {/* Globe itself */}
                <Globe textureUrl="/earth.jpg" />

                {/* Subtle atmosphere */}
                <mesh>
                  <sphereGeometry args={[2.05, 64, 64]} />
                  <meshBasicMaterial color="#80b3ff" transparent opacity={0.15} />
                </mesh>

                {/* Points */}
                <PointsLayer points={points} onHover={setHovered} />
              </RotatingGroup>

              {/* Controls */}
              <OrbitControls enablePan={false} enableZoom={true} maxPolarAngle={Math.PI} />
            </Suspense>
          </Canvas>
        </div>

        <div className="mt-4">
          <p className="text-sm">
            Points plotted: <strong>{points.length}</strong>
          </p>

          {hovered ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 p-3 bg-white rounded shadow"
            >
              <strong className="text-[#800000]">{hovered.surname}</strong>
              <div className="text-xs text-gray-600">{hovered.region}</div>
              <div className="text-xs mt-1">
                Lat: {hovered.lat.toFixed(2)}, Lng: {hovered.lng.toFixed(2)}
              </div>
            </motion.div>
          ) : (
            <p className="text-sm text-gray-600 mt-3">
              Hover over a point to preview the surname's origin.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
