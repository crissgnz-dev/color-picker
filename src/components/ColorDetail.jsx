import { FaRegCopy } from "react-icons/fa";
import { useCallback, useState, useEffect } from "react";
import "./ColorDetail.css";
import {
  hsvToRgb,
  rgbToHex,
  hexToHsv,
  rgbToHsv,
} from "../utils/colorConversions.js";

const hsvToDisplay = (hsv) => ({
  h: hsv.h,
  s: parseFloat((hsv.s * 100).toFixed(2)),
  v: parseFloat((hsv.v * 100).toFixed(2)),
});

export default function ColorDetail({ color, onColorChange }) {
  const displayHsv = color.hsv;

  const [inputHex, setInputHex] = useState(color.hex);
  const [inputRgb, setInputRgb] = useState(
    `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
  );
  const [inputHsv, setInputHsv] = useState(
    `hsv(${displayHsv.h}, ${displayHsv.s}%, ${displayHsv.v}%)`
  );

  useEffect(() => {
    const newDisplayHsv = color.hsv;
    setInputHex(color.hex);
    setInputRgb(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`);
    setInputHsv(
      `hsv(${newDisplayHsv.h}, ${newDisplayHsv.s}%, ${newDisplayHsv.v}%)`
    );
  }, [color]);

  // Esta función notifica el cambio en el formato **0-1** esperado por App.jsx
  const emitColorChange = (newDisplayHsv) => {
    // Objeto HSV en formato 0-1 que App.jsx guardará
    const newHsvForApp = {
      h: newDisplayHsv.h,
      s: newDisplayHsv.s, // CONVERSIÓN: 0-100 a 0-1
      v: newDisplayHsv.v, // CONVERSIÓN: 0-100 a 0-1
    };

    // Calcular RGB y HEX usando el formato de visualización (0-100)
    const newRgb = hsvToRgb(newDisplayHsv.h, newDisplayHsv.s, newDisplayHsv.v);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);

    const colorDataForApp = {
      hsv: newHsvForApp, // 0-1
      rgb: newRgb,
      hex: newHex,
    };

    onColorChange(colorDataForApp);
  };

  const handleHexInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInputHex(value);

    if (/^#?([0-9A-F]{3}){1,2}$/i.test(value)) {
      const hsvIn0_100 = hexToHsv(value);
      emitColorChange(hsvIn0_100);
    }
  };

  const handleRgbInputChange = (e) => {
    const value = e.target.value;
    setInputRgb(`rgb(${value})`);

    const cleanValue = value.replace(/[^0-9,\s]/g, "");
    const parts = cleanValue.split(",").map((p) => parseInt(p.trim()));

    if (
      parts.length === 3 &&
      parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)
    ) {
      const [r, g, b] = parts;
      const hsvIn0_100 = rgbToHsv(r, g, b);
      emitColorChange(hsvIn0_100);
    }
  };

  const handleHsvInputChange = (e) => {
    const value = e.target.value;
    setInputHsv(value);

    const cleanValue = value.replace(/[^0-9,.\s]/g, "");
    const parts = cleanValue.split(",").map((p) => parseFloat(p.trim()));

    if (parts.length === 3 && parts.every((p) => !isNaN(p))) {
      const [h, s, v] = parts;
      if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && v >= 0 && v <= 100) {
        emitColorChange({ h, s, v });
      }
    }
  };

  const handleCopy = useCallback(async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error("Error al intentar copiar:", err);
    }
  }, []);

  const rgbStringCopy = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
  const hsvStringCopy = `hsv(${displayHsv.h}, ${displayHsv.s}%, ${displayHsv.v}%)`;

  return (
    <div className="colorInfo">
      <div
        className="cajaColor"
        style={{
          backgroundColor: color.hex,
        }}
      />

      <div className="colorData">
        {/* --- HEX --- */}
        <div className="info" style={{ border: "1px solid " + color.hex }}>
          <div>
            <div className="circle" style={{ backgroundColor: color.hex }} />
            <p>HEX</p>
          </div>
          <div style={{ borderLeft: "1px solid " + color.hex }}>
            <input
              type="text"
              value={inputHex}
              onChange={handleHexInputChange}
            />
            <button onClick={() => handleCopy(color.hex)}>
              <FaRegCopy color={color.hex} size={16} />
            </button>
          </div>
        </div>

        {/* --- RGB --- */}
        <div className="info" style={{ border: "1px solid " + color.hex }}>
          <div>
            <div className="circle" style={{ backgroundColor: color.hex }} />
            <p>RGB</p>
          </div>
          <div style={{ borderLeft: "1px solid " + color.hex }}>
            <input
              type="text"
              value={inputRgb}
              onChange={handleRgbInputChange}
            />
            <button onClick={() => handleCopy(rgbStringCopy)}>
              <FaRegCopy color={color.hex} size={16} />
            </button>
          </div>
        </div>

        {/* --- HSV --- */}
        <div className="info" style={{ border: "1px solid " + color.hex }}>
          <div>
            <div className="circle" style={{ backgroundColor: color.hex }} />
            <p>HSV</p>
          </div>
          <div style={{ borderLeft: "1px solid " + color.hex }}>
            <input
              type="text"
              value={inputHsv}
              onChange={handleHsvInputChange}
            />
            <button onClick={() => handleCopy(hsvStringCopy)}>
              <FaRegCopy color={color.hex} size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
