import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Generates a mock point cloud representing a terrain/environment
function PointCloud() {
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = 20000;

  // Create a terrain-like structure
  const positions = useMemo(() => {
    // We use a simple seeded random to avoid purity issues in useMemo
    let seed = 1;
    const random = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Scatter points in a radius
      const r = random() * 20;
      const theta = random() * 2 * Math.PI;

      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);

      // Terrain height (y) using sine waves for bumps + some noise
      let y = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 1.5;

      // Add some "obstacles" (taller clusters)
      if (random() > 0.98) {
          y += random() * 4 + 1;
      }

      // Add a central flat area for the robot
      if (r < 3) {
          y = random() * 0.2;
      }

      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, [particleCount]);

  const colors = useMemo(() => {
      const arr = new Float32Array(particleCount * 3);
      for(let i=0; i < particleCount; i++) {
          const y = positions[i * 3 + 1];
          // Color based on height (intensity)
          const color = new THREE.Color();
          if (y > 2) color.setHex(0xef4444); // Red for high obstacles
          else if (y > 0.5) color.setHex(0xf59e0b); // Yellow for medium
          else color.setHex(0x10b981); // Green for floor/low

          arr[i*3] = color.r;
          arr[i*3+1] = color.g;
          arr[i*3+2] = color.b;
      }
      return arr;
  }, [positions, particleCount]);


  // Simulate scanner sweep
  useFrame((state) => {
    if (pointsRef.current) {
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Represent the robot's position and scanning laser
function ScannerEffect() {
    const sweepRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (sweepRef.current) {
            sweepRef.current.rotation.y = state.clock.elapsedTime * 5; // Fast spin
        }
    });

    return (
        <group>
            {/* Robot Core Marker */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshBasicMaterial color="#3b82f6" wireframe />
            </mesh>

            {/* Lidar Sweep Volume */}
            <mesh ref={sweepRef} position={[0, 0, 0]}>
                <cylinderGeometry args={[20, 20, 0.1, 32, 1, true, 0, Math.PI / 4]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.1} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    );
}

export default function LidarMap() {
  return (
    <div className="w-full h-full relative bg-black font-mono">
        <div className="absolute top-4 left-4 z-10 bg-black/80 p-4 border border-zinc-800 rounded font-mono text-xs text-zinc-400">
            <h3 className="text-emerald-400 font-bold mb-2">LIDAR TELEMETRY</h3>
            <p>POINTS: <span className="text-emerald-500">20,000</span></p>
            <p>SWEEP RATE: <span className="text-emerald-500">10Hz</span></p>
            <p>RANGE: <span className="text-emerald-500">20m</span></p>
            <p className="mt-2 text-zinc-500">MODE: 3D SLAM Mapping</p>
        </div>

      <Canvas camera={{ position: [10, 15, 10], fov: 60 }}>
        <color attach="background" args={['#000000']} />

        <ScannerEffect />
        <PointCloud />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          maxDistance={40}
          minDistance={5}
        />

        {/* Helper grids */}
        <gridHelper args={[40, 40, '#10b981', '#18181b']} position={[0, -2, 0]} />
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  );
}
