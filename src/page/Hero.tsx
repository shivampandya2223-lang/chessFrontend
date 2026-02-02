import { Canvas } from "@react-three/fiber";
import ChessModel from "../hooks/chess-model";
import { Environment, OrbitControls } from "@react-three/drei";
const Hero = () => {
  const { scene } = ChessModel();
  return (
    <Canvas camera={{ position: [3, 3, 4], fov: 45 }}>
      <Environment files="./background.exr" background />
      <ambientLight />
      <directionalLight />
      <primitive object={scene} scale={2} />
      <OrbitControls />
    </Canvas>
  );
};

export default Hero;
