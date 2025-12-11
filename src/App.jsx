// App.jsx (VERSIÓN CORREGIDA PARA ELIMINAR EL BUCLE)

import "./App.css";
import { useState, useCallback } from "react";
import ColorDetail from "./components/ColorDetail.jsx";
import ColorSelector from "./components/ColorSelector.jsx";

// FUNCIÓN DE SEGURIDAD CRÍTICA: Compara los valores de color para evitar re-renderizados innecesarios.
const areColorObjectsEqual = (c1, c2) => {
  if (!c1 || !c2) return false;

  // 1. Comparar HEX
  if (c1.hex !== c2.hex) return false;

  // 2. Comparar RGB
  if (c1.rgb.r !== c2.rgb.r || c1.rgb.g !== c2.rgb.g || c1.rgb.b !== c2.rgb.b)
    return false;

  // 3. Comparar HSV (Usamos Math.round para mayor seguridad, aunque Colord y ColorSelector
  // deberían entregarlos ya redondeados)
  const hsv1 = c1.hsv;
  const hsv2 = c2.hsv;
  if (
    Math.round(hsv1.h) !== Math.round(hsv2.h) ||
    Math.round(hsv1.s) !== Math.round(hsv2.s) ||
    Math.round(hsv1.v) !== Math.round(hsv2.v)
  )
    return false;

  // Si todos los valores numéricos son idénticos, consideramos que los objetos son iguales.
  return true;
};

function App() {
  const [color, setColor] = useState({
    hsv: { h: 0, s: 100, v: 100 },
    rgb: { r: 255, g: 0, b: 0 },
    hex: "#FF0000",
  });

  const handleColorChange = useCallback((newColor) => {
    setColor((oldColor) => {
      if (areColorObjectsEqual(oldColor, newColor)) {
        return oldColor; // 🛑 Rompe el ciclo
      }
      return newColor;
    });
  }, []);

  return (
    <>
      <main className="mainApp">
        <section
          style={{
            filter: `drop-shadow(2px 2px 2px ${color.hex})`,
          }}>
          <h1>Color Picker</h1>
        </section>

        <div
          className="container"
          style={{
            border: "1px solid " + color.hex,
            padding: "40px",
            borderRadius: "15px",
            filter: "drop-shadow(0px 0px 1px #aaa)",
          }}>
          <ColorDetail color={color} onColorChange={handleColorChange} />
          <ColorSelector hex={color.hex} onChange={handleColorChange} />
        </div>
        {/* <a
          href="https://github.com/crissgnz-dev"
          target="_blank"
          className="github">
          @crissgnz-dev
        </a> */}
      </main>
    </>
  );
}

export default App;
