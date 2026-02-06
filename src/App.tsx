import Game from "./page/Game";
import Hero from "./page/Hero";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import { useSocket } from "./utils/useSocket";

const App = () => {
  // Global socket listener
  useSocket();

  return (
    <div className=" h-screen w-screen">
      <Router>
        <Routes>
          <Route element={<Hero />} path="/" />
          <Route element={<Hero />} path="/home" />
          <Route element={<Game />} path="/game" />
          <Route element={<LoginPage />} path="/loginPage" />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
