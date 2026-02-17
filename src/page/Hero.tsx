/* eslint-disable @typescript-eslint/no-explicit-any */
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, Float } from "@react-three/drei";
import { useRef, useMemo, useState } from "react";
import { Group } from "three";
import ChessModel from "../hooks/chess-model";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCreateRoomMutation } from "../queries/game.queries";
import { isLoggedIn } from "../utils/auth";
import { socketActions } from "../socket/socketActions";
import { FaPlay, FaUserFriends, FaChevronRight } from "react-icons/fa";
import { useGameStore } from "../store/gameStore";

const RotatingChess = () => {
  const { scene } = ChessModel();
  const groupRef = useRef<Group>(null);
  const heroScene = useMemo(() => scene.clone(), [scene]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.005;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <primitive object={heroScene} scale={2.5} position={[0, -0.5, 0]} />
      </Float>
    </group>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [showFriendInput, setShowFriendInput] = useState(false);
  const [opponentUsername, setOpponentUsername] = useState("");
  const { mutate: createRoom, isPending: creatingRoom } =
    useCreateRoomMutation();

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
          const room = res.data.room || res.data;
          const gameId = room.gameId || room.id;
          const toUserId = room.opponentId;

          // Store gameId in localStorage
          if (gameId) {
            localStorage.setItem("gameId", gameId);
          }

          if (toUserId && gameId) {
            socketActions.sendGameRequest(toUserId, gameId);
          }
          navigate("/game");
        },
        onError: (err) => {
          console.error("Failed to create room:", err);
          alert("Error creating room. Make sure the opponent exists.");
        },
      },
    );
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-[#020617]">
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [-5, 3, 5], fov: 40 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.5}
            color="#8b5cf6"
          />

          <RotatingChess />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Decorative Overlays */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#020617]/40 to-[#020617] pointer-events-none z-1" />
      <div className="absolute inset-0 bg-radial-at-tl from-blue-500/10 via-transparent to-transparent pointer-events-none z-1" />

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6">
        <div className="max-w-4xl w-full text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-semibold mb-8 backdrop-blur-sm animate-float">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            NEXT GENERATION CHESS
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            Master the{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-600">
              3D Board
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            An immersive multiplayer chess experience with world-class physics
            and stunning visuals.
          </p>

          <div className="flex flex-col items-center gap-6">
            {!showFriendInput ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="btn-premium btn-primary flex items-center gap-3 text-lg px-10 group"
                  onClick={() => navigate("/offline-game")}
                >
                  <FaPlay className="text-sm group-hover:translate-x-1 transition-transform" />
                  OFFLINE GAME
                </button>
                <button
                  className="btn-premium btn-secondary flex items-center gap-3 text-lg px-10"
                  onClick={() => setShowFriendInput(true)}
                >
                  <FaUserFriends className="text-lg" />
                  WITH FRIEND
                </button>
                <button
                  className="btn-premium btn-primary flex items-center gap-3 text-lg px-10 group"
                  onClick={() => {
                    useGameStore.getState().startAIGame(20);
                    navigate("/game");
                  }}
                >
                  <FaPlay className="text-sm group-hover:translate-x-1 transition-transform" />
                  PLAY WITH AI
                </button>
              </div>
            ) : (
              <div className="w-full max-w-md glass-panel p-8 animate-in zoom-in-95 duration-300">
                <h3 className="text-xl font-bold text-white mb-6">
                  Challenge a Friend
                </h3>
                <form
                  onSubmit={handlePlayWithFriend}
                  className="flex flex-col gap-4"
                >
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Enter opponent's username"
                      value={opponentUsername}
                      onChange={(e) => setOpponentUsername(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-md"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={creatingRoom}
                      className="flex-1 btn-premium btn-primary py-4 text-base flex items-center justify-center gap-2"
                    >
                      {creatingRoom ? (
                        "CREATING..."
                      ) : (
                        <>
                          GO <FaChevronRight className="text-xs" />
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="px-6 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all text-sm font-semibold"
                      onClick={() => setShowFriendInput(false)}
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <Navbar />

      {/* Footer Decoration */}
      <div className="absolute bottom-10 left-10 hidden md:block z-10 animate-fade-in delay-700">
        <p className="text-white/20 text-xs font-mono tracking-widest uppercase">
          EST. 2024 • GLOBAL SERVER STATUS: ONLINE
        </p>
      </div>
    </div>
  );
};

export default Hero;
