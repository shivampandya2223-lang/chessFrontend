import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { ChessScene } from '../components/ChessScene';
import { GameUI } from '../components/GameUI';
import { ModelInspector } from '../components/ModelInspector';
import { Suspense } from 'react';

const Game = () => {
  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 3D Canvas */}
      <Canvas
        shadows
        className="absolute top-0 left-0 w-full h-full"
        gl={{ antialias: true, alpha: false }}
      >
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 6, 6]} fov={50} />

        {/* Environment and Lighting */}
        <Suspense fallback={null}>
          <Environment files="/background.exr" background={false} />
        </Suspense>

        {/* Ambient lighting for overall scene brightness */}
        <ambientLight intensity={0.4} />

        {/* Main directional light (sun-like) */}
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Fill light from opposite side */}
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />

        {/* Rim light for depth */}
        <spotLight
          position={[0, 10, 0]}
          angle={0.6}
          penumbra={1}
          intensity={0.5}
          castShadow
        />

        {/* Point lights for dramatic effect */}
        <pointLight position={[3, 3, 3]} intensity={0.3} color="#60a5fa" />
        <pointLight position={[-3, 3, -3]} intensity={0.3} color="#a78bfa" />

        {/* Chess Scene */}
        <Suspense fallback={null}>
          <ModelInspector />
          <ChessScene />
        </Suspense>

        {/* Camera Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.05}
        />

        {/* Ground plane for shadows */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.11, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
      </Canvas>

      {/* UI Overlay */}
      <GameUI />

      {/* Loading indicator */}
      <div className="absolute bottom-6 left-6 text-white/50 text-sm pointer-events-none">
        Use mouse to rotate • Scroll to zoom
      </div>
    </div>
  );
};

export default Game;
