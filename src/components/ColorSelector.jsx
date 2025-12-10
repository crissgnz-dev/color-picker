// ColorSelector.jsx (Usando react-colorful)

import React, { useCallback } from "react";
import { HexColorPicker } from "react-colorful"; // Componente principal para el selector de color
import useEyeDropper from "use-eye-dropper";
import { FaEyeDropper } from "react-icons/fa6";
import "./ColorSelector.css";

import { hexToHsv, hsvToRgb } from "../utils/colorConversions.js";

// Componente para el EyeDropper (se mantiene tu lógica)
function EyeDropperButton({ hex, onChange }) {
  const { open, isSupported } = useEyeDropper();

  const handleEyeDropper = useCallback(async () => {
    if (!isSupported()) {
      console.warn("EyeDropper no es compatible con el navegador");
      return;
    }

    try {
      const { sRGBHex } = await open();
      // react-colorful usa formato HEX, lo pasamos directamente a App.jsx
      onChange(sRGBHex);
    } catch (e) {
      console.error("error dropper:", e);
    }
  }, [open, isSupported, onChange]);

  return (
    <button
      className="dropper"
      onClick={handleEyeDropper}
      disabled={!isSupported()}>
      <FaEyeDropper color={hex} size={16} />
    </button>
  );
}

export default function ColorSelector({ hex, onChange }) {
  // Maneja el cambio de color desde el picker o el EyeDropper
  const handleColorChange = useCallback(
    (newHex) => {
      // 1. Convertir HEX (el output del picker) al formato HSV (0-100)
      const newHsv = hexToHsv(newHex);

      // 2. Convertir a RGB
      const newRgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);

      // 3. Notificar a App.jsx con el objeto completo
      onChange({
        hsv: newHsv, // {h: 0-360, s: 0-100, v: 0-100}
        rgb: {
          r: Math.round(newRgb.r),
          g: Math.round(newRgb.g),
          b: Math.round(newRgb.b),
        },
        hex: newHex.toUpperCase(),
      });
    },
    [onChange]
  );

  return (
    <div className="selectorContainer">
      <HexColorPicker
        color={hex}
        onChange={handleColorChange}
        style={{ width: 300, height: 315 }}
      />
      <EyeDropperButton hex={hex} onChange={handleColorChange} />
    </div>
  );
}
