import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useEffect } from "react";

import Navbar from "../components/Navbar";
import { ModelInspector } from "../game/ModelInspector";
import { ChessScene } from "../game/ChessScene";
import { useGameStore } from "../store/gameStore";
import { GameUI } from "../game/GameUI";

const Offline = () => {
  const { startOfflineGame } = useGameStore();

  useEffect(() => {
    startOfflineGame();
  }, [startOfflineGame]);

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-[#020617]">
      <Canvas
        shadows
        className="absolute inset-0 z-0"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 6, 6]} fov={50} />

        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Cinematic Rim Lights */}
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#3b82f6" />
        <pointLight position={[-10, 5, -10]} intensity={0.8} color="#8b5cf6" />
        <spotLight
          position={[0, 15, 0]}
          angle={0.4}
          penumbra={1}
          intensity={1}
          castShadow
        />

        <Suspense fallback={null}>
          {import.meta.env.DEV && <ModelInspector />}
          <ChessScene />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={4}
          maxDistance={12}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.05}
        />

        {/* Shadow Plane */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.41, 0]}
          receiveShadow
        >
          <planeGeometry args={[30, 30]} />
          <shadowMaterial opacity={0.4} />
        </mesh>
      </Canvas>

      {/* Decorative Overlays for depth */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#020617]/40 pointer-events-none z-1" />
      <div className="absolute inset-0 bg-radial-at-tl from-blue-500/5 via-transparent to-transparent pointer-events-none z-1" />

      <Navbar />
      <GameUI />

      <div className="absolute bottom-6 left-6 text-white/30 text-[10px] font-bold tracking-widest uppercase pointer-events-none z-10 transition-opacity hover:opacity-100 italic">
        3D Render Engine Active • Offline Mode • Drag to rotate
      </div>
    </div>
  );
};

export default Offline;
