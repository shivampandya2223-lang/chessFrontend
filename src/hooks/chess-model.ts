import { useGLTF } from "@react-three/drei";
import { Group } from "three";

export default function ChessModel(){
    const gltf = useGLTF("./chessThree.glb") as {
        scene: Group;
    };
    return gltf;
}