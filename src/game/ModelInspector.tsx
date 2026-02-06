import { useEffect } from "react";
import ChessModel from "../hooks/chess-model";

/**
 * Debug component to inspect the structure of the chess GLB model
 * This will log all objects in the model to help you understand how to map pieces
 */
export const ModelInspector = () => {
  const { scene } = ChessModel();

  useEffect(() => {
    let meshCount = 0;
    let groupCount = 0;

    scene.traverse((child) => {
      if (child.type === "Mesh") {
        meshCount++;
        // console.log(`Mesh ${meshCount}:`, {
        //   name: child.name,
        //   type: child.type,
        //   position: child.position,
        //   userData: child.userData,
        // });
      } else if (child.type === "Group") {
        groupCount++;
        // console.log(`Group ${groupCount}:`, {
        //   name: child.name,
        //   type: child.type,
        //   children: child.children.length,
        // });
      }
    });

    console.log(`Total Meshes: ${meshCount}`);
    console.log(`Total Groups: ${groupCount}`);
    console.log("=== END MODEL STRUCTURE ===");
  }, [scene]);

  return null;
};
