import Game from "./page/Game";
import Hero from "./page/Hero";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div className=" h-screen w-screen">
      <Router>
        <Routes>
          <Route element={<Hero />} path="/" />
          <Route element={<Hero />} path="/home" />
          <Route element={<Game />} path="/game" />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
