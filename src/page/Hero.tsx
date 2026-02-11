import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { useRef, useMemo, useState } from "react";
import { Group } from "three";
import ChessModel from "../hooks/chess-model";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCreateRoomMutation } from "../queries/game.queries";
import { isLoggedIn } from "../utils/auth";
import { socketActions } from "../socket/socketActions";


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
  const [showFriendInput, setShowFriendInput] = useState(false);
  const [opponentUsername, setOpponentUsername] = useState("");
  const { mutate: createRoom, isPending: creatingRoom } = useCreateRoomMutation();

  const handlePlayWithFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      navigate("/loginPage");
      return;
    }

    if (!opponentUsername.trim()) return;

    createRoom(
      { opponentUsername },
      {
        onSuccess: (res: any) => {
          console.log("Room created API response:", res.data);

          // Get the toUserId from the response
          const room = res.data.room || res.data;
          const toUserId = room.opponentId;

          // Send a challenge request via socket so the opponent gets a notification
          if (toUserId) {
            socketActions.sendGameRequest(toUserId);
          }

          navigate("/game");

        },
        onError: (err) => {
          console.error("Failed to create room:", err);
          alert("Error creating room. Make sure the opponent exists.");
        },
      }
    );
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
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
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 pointer-events-none">
        <div className="text-center text-white bg-black/40 w-full p-10 md:p-30 pointer-events-auto ">
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
            Welcome to 3D Chess
          </h1>
          <p className="mt-4 text-lg md:text-xl drop-shadow-md">
            Experience chess like never before
          </p>

          <div className="pt-10 flex flex-col items-center gap-4">
            {!showFriendInput ? (
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  className="h-16 w-52 btn text-2xl"
                  onClick={() => navigate("/game")}
                >
                  PLAY SOLO
                </button>
                <button
                  className="h-16 w-64 btn text-2xl bg-purple-600 hover:bg-purple-700"
                  onClick={() => setShowFriendInput(true)}
                >
                  WITH FRIEND
                </button>
              </div>
            ) : (
              <form onSubmit={handlePlayWithFriend} className="flex flex-col items-center gap-4 w-full max-w-md">
                <div className="w-full relative">
                  <input
                    type="text"
                    placeholder="Friend's username"
                    value={opponentUsername}
                    onChange={(e) => setOpponentUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-md"
                    autoFocus
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={creatingRoom}
                    className="h-14 w-40 btn text-xl bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    {creatingRoom ? "CREATING..." : "START"}
                  </button>
                  <button
                    type="button"
                    className="h-14 w-40 btn text-xl bg-gray-600 hover:bg-gray-700"
                    onClick={() => setShowFriendInput(false)}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Hero;
