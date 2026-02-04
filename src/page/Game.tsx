import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense } from "react";

import { ChessScene } from "../game/ChessScene";
import { GameUI } from "../game/GameUI";
import { ModelInspector } from "../game/ModelInspector";

const Game = () => {
  return (
    <div className="h-screen w-screen relative overflow-hidden bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <Canvas
        shadows
        className="absolute inset-0"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
      >
        <PerspectiveCamera makeDefault position={[0, 6, 6]} fov={50} />

        <Suspense fallback={null}>
          <Environment files="/background.exr" background={false} />
        </Suspense>

        <ambientLight intensity={0.35} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.25} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.6}
          penumbra={1}
          intensity={0.4}
          castShadow
        />
        <pointLight position={[3, 3, 3]} intensity={0.25} color="#60a5fa" />
        <pointLight position={[-3, 3, -3]} intensity={0.25} color="#a78bfa" />

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
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.05}
        />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.11, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
      </Canvas>

      <GameUI />

      <div className="absolute bottom-6 left-6 text-white/50 text-sm pointer-events-none">
        Use mouse to rotate • Scroll to zoom
      </div>
    </div>
  );
};

export default Game;
