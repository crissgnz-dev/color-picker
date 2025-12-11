import React, { useCallback, memo } from "react";
import { HexColorPicker } from "react-colorful"; // Componente principal para el selector de color
import useEyeDropper from "use-eye-dropper";
import { FaEyeDropper } from "react-icons/fa6";
import "./ColorSelector.css";
import { colord } from "colord";

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
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "end",
      }}>
      <button
        className="dropper"
        onClick={handleEyeDropper}
        disabled={!isSupported()}>
        <FaEyeDropper color={hex} size={18} />
      </button>
    </div>
  );
}

export default function ColorSelector({ hex, onChange }) {
  const handleColorChange = useCallback(
    (newHex) => {
      // 1. CREAR UNA INSTANCIA CON EL HEX DEL PICKER
      const colorInstance = colord(newHex);

      // 2. EXTRAER VALORES Y REDONDEAR SOLO LO NECESARIO PARA TU ESTADO
      const hsv = colorInstance.toHsv();
      const rgb = colorInstance.toRgb();
      const finalHex = colorInstance.toHex().toUpperCase();

      // 3. Notificar a App.jsx con el objeto más estable posible
      onChange({
        // Redondeamos HSV para que el chequeo en App.jsx sea determinista
        hsv: {
          h: Math.round(hsv.h),
          s: Math.round(hsv.s),
          v: Math.round(hsv.v),
        },
        // RGB de colord ya son enteros
        rgb: { r: rgb.r, g: rgb.g, b: rgb.b },
        // HEX de colord es la representación más precisa de estos valores
        hex: finalHex,
      });
    },
    [onChange]
  );

  return (
    <div className="selectorContainer">
      <HexColorPicker
        color={hex}
        onChange={handleColorChange}
        style={{ width: "100%", height: 300 }}
      />
      <EyeDropperButton hex={hex} onChange={handleColorChange} />
    </div>
  );
}
