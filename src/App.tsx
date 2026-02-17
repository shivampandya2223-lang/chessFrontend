import Game from "./page/Game";
import Hero from "./page/Hero";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import { useSocket } from "./utils/useSocket";
import { Toaster } from "react-hot-toast";
import Offline from "./page/offline";
import AIGame from "./page/AIGame";

const SocketListener = () => {
  useSocket();
  return null;
};

const App = () => {
  return (
    <div className=" h-screen w-screen">
      <Router>
        <Toaster
          position="top-center"
          reverseOrder={false}
          containerStyle={{
            top: 40,
          }}
        />
        <SocketListener />
        <Routes>
          <Route element={<Hero />} path="/" />
          <Route element={<Hero />} path="/home" />
          <Route element={<Game />} path="/game" />
          <Route element={<LoginPage />} path="/loginPage" />
          <Route element={<Offline />} path="/offline-game" />
          <Route element={<AIGame />} path="/ai-game" />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
