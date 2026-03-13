import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Line, Box, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// A conceptual representation of the GAPbot (Hexapod)
function GAPbot({ position = [0, 0, 0], rotation = [0, 0, 0] }: { position?: [number, number, number], rotation?: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // Subtle hovering and rotation animation
  useFrame((state) => {
    if (groupRef.current) {
       groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.5;
       groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
    if(coreRef.current) {
        coreRef.current.rotation.x = state.clock.elapsedTime * 0.5;
        coreRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Central Chassis / Main Body */}
      <Box args={[1.5, 0.4, 1]} castShadow receiveShadow>
        <meshStandardMaterial color="#27272a" metalness={0.8} roughness={0.2} />
      </Box>

      {/* Top Dome / Lidar Array */}
      <Sphere args={[0.3, 32, 32]} position={[0, 0.35, 0]} castShadow>
         <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} wireframe />
      </Sphere>

      {/* Energy Core (EcoMind processor representation) */}
      <Sphere ref={coreRef} args={[0.2, 16, 16]} position={[0, 0, 0]}>
        <MeshDistortMaterial color="#34d399" emissive="#34d399" emissiveIntensity={2} distort={0.4} speed={4} />
      </Sphere>

      {/* 6 Legs (Abstract representation) */}
      {[
        [-0.8, -0.2, 0.6], [0, -0.2, 0.7], [0.8, -0.2, 0.6],
        [-0.8, -0.2, -0.6], [0, -0.2, -0.7], [0.8, -0.2, -0.6]
      ].map((pos, idx) => (
        <group key={idx} position={pos as [number, number, number]}>
           {/* Thigh */}
           <Box args={[0.1, 0.5, 0.1]} position={[0, -0.2, 0]} rotation={[0, 0, pos[0] > 0 ? -0.5 : 0.5]} castShadow>
               <meshStandardMaterial color="#3f3f46" metalness={0.9} roughness={0.1} />
           </Box>
           {/* Calf */}
           <Box args={[0.05, 0.6, 0.05]} position={[pos[0] > 0 ? 0.2 : -0.2, -0.6, 0]} rotation={[0, 0, pos[0] > 0 ? 0.2 : -0.2]} castShadow>
               <meshStandardMaterial color="#52525b" />
           </Box>
           {/* Foot Pad */}
            <Sphere args={[0.08, 16, 16]} position={[pos[0] > 0 ? 0.3 : -0.3, -0.9, 0]} castShadow>
               <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.8} />
            </Sphere>
        </group>
      ))}

      {/* Sensor Array Lines */}
      <Line points={[[-0.75, 0.2, 0.5], [-1.5, 0.5, 1]]} color="#10b981" lineWidth={2} dashed />
      <Line points={[[0.75, 0.2, -0.5], [1.5, 0.5, -1]]} color="#10b981" lineWidth={2} dashed />

    </group>
  );
}

export default function DigitalTwin() {
  return (
    <div className="w-full h-full relative bg-zinc-950">
        <div className="absolute top-4 left-4 z-10 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 backdrop-blur-md">
            <h3 className="text-emerald-400 font-bold mb-2 uppercase text-sm tracking-wider">Live Twin Status</h3>
            <div className="space-y-1 text-xs text-zinc-300 font-mono">
                <p>Status: <span className="text-emerald-500">Nominal</span></p>
                <p>Mode: Autonomous Patrol</p>
                <p>Posture: Defensive C-2</p>
                <p>Actuators: 18/18 Online</p>
            </div>
        </div>

      <Canvas shadows camera={{ position: [4, 3, 5], fov: 45 }}>
        <color attach="background" args={['#09090b']} />

        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} />
        <spotLight position={[5, 10, 5]} angle={0.25} penumbra={1} intensity={2} castShadow shadow-mapSize={[2048, 2048]} color="#10b981" />
        <pointLight position={[-5, 5, -5]} intensity={1} color="#3b82f6" />
        <rectAreaLight width={5} height={5} color="#10b981" intensity={5} position={[0, -2, 0]} lookAt={[0, 0, 0]} />

        {/* The Robot */}
        <GAPbot />

        {/* Environment Grid */}
        <Grid
          infiniteGrid
          fadeDistance={20}
          sectionColor="#10b981"
          cellColor="#27272a"
          sectionSize={2}
          cellSize={0.5}
          sectionThickness={1.5}
          cellThickness={0.5}
        />

        <Environment preset="city" environmentIntensity={0.2} background blur={0.8} />

        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2 - 0.1}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
