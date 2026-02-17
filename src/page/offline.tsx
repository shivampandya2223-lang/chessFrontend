import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense } from "react";

import Navbar from "../components/Navbar";
import { ModelInspector } from "../game/ModelInspector";
import { ChessScene } from "../game/ChessScene";
import { ChessBoard } from "../game/ChessBoard";
import type { Square } from "chess.js";
const Offline = () => {
  return (
    <div className="h-screen w-screen relative overflow-hidden">
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
      </Canvas>

      <Navbar />
      <ChessBoard
        onSquareClick={function (square: Square): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
};

export default Offline;
