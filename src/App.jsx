import "./App.css";
import { useState, useCallback, useEffect } from "react";
import ColorDetail from "./components/ColorDetail.jsx";
import ColorSelector from "./components/ColorSelector.jsx";

// FUNCIÓN DE SEGURIDAD CRÍTICA: Compara los valores de color para evitar re-renderizados innecesarios.
const areColorObjectsEqual = (c1, c2) => {
  if (!c1 || !c2) return false;
  return c1.hex === c2.hex;
};

function App() {
  const [color, setColor] = useState({
    hsv: { h: 0, s: 100, v: 100 },
    rgb: { r: 255, g: 0, b: 0 },
    hex: "#FF0000",
  });

  // Sincronizar el color seleccionado con las variables CSS globales
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-color", color.hex);
    root.style.setProperty("--accent-rgb", `${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`);
  }, [color]);

  const handleColorChange = useCallback((newColor) => {
    setColor((oldColor) => {
      // Si recibimos un string HEX directamente (del dropper o similar)
      if (typeof newColor === "string") {
        return oldColor; // Deberíamos normalizarlo si fuera el caso, pero ColorSelector ya manda objetos
      }

      if (areColorObjectsEqual(oldColor, newColor)) {
        return oldColor;
      }
      return newColor;
    });
  }, []);

  return (
    <main className="main-wrapper">
      <div className="background-glow" />

      <header className="hero-section">
        <h1 className="main-title">
          Color <span className="accent-text">Picker</span>
        </h1>
      </header>


      <div className="glass-container">
        <div className="content-grid">
          <section className="detail-panel">
            <ColorDetail color={color} onColorChange={handleColorChange} />
          </section>

          <section className="selector-panel">
            <ColorSelector hex={color.hex} onChange={handleColorChange} />
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;

