import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import { Navbar } from "./navbar";
import { ParticleCircle } from "./pages/particles";
import { ParticleText } from "./pages/text";

function App() {
  const navItems = [
    { label: "Particle", page: "particle" },
    { label: "Text", page: "text" },
  ];
  return (
    <>
      <Navbar items={navItems} />
      <Routes>
        <Route
          path="/particle"
          element={<ParticleCircle />}
        />
        <Route
          path="/text"
          element={<ParticleText />}
        />
      </Routes>
    </>
  );
}

export default App;
