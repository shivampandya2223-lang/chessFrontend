import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import { Group } from "three";
import ChessModel from "../hooks/chess-model";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const RotatingChess = () => {
  const { scene } = ChessModel();
  const groupRef = useRef<Group>(null);
  const heroScene = useMemo(() => scene.clone(), [scene]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.002;
  });

  return (
    <group ref={groupRef}>
      <primitive object={heroScene} scale={2.2} />
    </group>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <Navbar />
      <Canvas
        camera={{ position: [-4, 3, 4], fov: 45 }}
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        <Environment files="/background.exr" background />

        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />

        <RotatingChess />

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10  ">
        <div className="text-center text-white bg-black/40 w-full p-30 ">
          <h1 className="text-6xl font-bold drop-shadow-lg">
            Welcome to 3D Chess
          </h1>
          <p className="mt-4 text-xl drop-shadow-md">
            Experience chess like never before
          </p>
          <div className="pt-10">
            <button
              className="h-20 w-60 bg-blue-500 rounded-2xl text-3xl font-bold cursor-pointer hover:scale-110 transition-all duration-75  hover:bg-blue-700"
              onClick={() => navigate("/game")}
            >
              PLAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
