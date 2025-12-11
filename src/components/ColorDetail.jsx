import { FaRegCopy } from "react-icons/fa";
import React, { useCallback, useState } from "react";
import "./ColorDetail.css";
import { colord } from "colord";

const roundColorValues = (color) => ({
  h: Math.round(color.h),
  s: Math.round(color.s),
  v: Math.round(color.v),
});

function ColorDetail({ color, onColorChange }) {
  const [editingInput, setEditingInput] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const displayHsv = roundColorValues(color.hsv);

  const getInputValue = useCallback(
    (type) => {
      // Si el usuario está editando, mostramos el valor local
      if (editingInput === type) {
        return inputValue;
      }

      // Si no, mostramos el valor de la prop (estado global)
      if (type === "hex") return color.hex;
      if (type === "rgb")
        return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
      if (type === "hsv")
        return `hsv(${displayHsv.h}, ${displayHsv.s}%, ${displayHsv.v}%)`;

      return "";
    },
    [editingInput, inputValue, color, displayHsv]
  );

  const emitColorChange = (colorString) => {
    const colorInstance = colord(colorString);
    if (!colorInstance.isValid()) {
      return;
    }

    // Utiliza colord para obtener los valores estables
    const hsv = colorInstance.toHsv();
    const rgb = colorInstance.toRgb();

    const colorDataForApp = {
      hsv: { h: Math.round(hsv.h), s: Math.round(hsv.s), v: Math.round(hsv.v) },
      rgb: { r: rgb.r, g: rgb.g, b: rgb.b },
      hex: colorInstance.toHex().toUpperCase(),
    };

    onColorChange(colorDataForApp);
    // ... (resetear estados locales)
  };

  // 🔴 NUEVOS HANDLERS UNIFICADOS
  const handleChange = (e, type, validatorFn, formatFn) => {
    const value = e.target.value;

    setEditingInput(type);
    setInputValue(value);

    // Si el valor es válido, lo emitimos
    if (validatorFn(value)) {
      const colorString = formatFn ? formatFn(value) : value;
      emitColorChange(colorString);
    }
  };

  const handleHexInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    handleChange(
      e,
      "hex",
      (v) => /^#?([0-9A-F]{3}){1,2}$/i.test(v), // Validación HEX simple
      (v) => v
    );
  };

  const handleRgbInputChange = (e) => {
    const value = e.target.value;
    const cleanValue = value.replace(/[^0-9,\s]/g, "");

    handleChange(
      e,
      "rgb",
      (v) => cleanValue.split(",").length === 3, // Validación de 3 números
      (v) =>
        `rgb(${cleanValue
          .split(",")
          .map((p) => parseInt(p.trim()))
          .join(",")})` // Formatea a string RGB
    );
  };

  const handleHsvInputChange = (e) => {
    const value = e.target.value;
    const cleanValue = value.replace(/[^0-9,.\s]/g, "");

    handleChange(
      e,
      "hsv",
      (v) => cleanValue.split(",").length === 3, // Validación de 3 números
      (v) => `hsv(${cleanValue.split(",").join(",")})` // Formatea a string HSV
    );
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
              value={getInputValue("hex")} // 🔴 USAR EL GETTER
              onChange={handleHexInputChange}
              onBlur={() => {
                setEditingInput(null);
                setInputValue("");
              }} // 🔴 LIMPIAR ESTADO AL SALIR
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
              value={getInputValue("rgb")} // 🔴 USAR EL GETTER
              onChange={handleRgbInputChange}
              onBlur={() => {
                setEditingInput(null);
                setInputValue("");
              }} // 🔴 LIMPIAR ESTADO AL SALIR
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
              value={getInputValue("hsv")} // 🔴 USAR EL GETTER
              onChange={handleHsvInputChange}
              onBlur={() => {
                setEditingInput(null);
                setInputValue("");
              }} // 🔴 LIMPIAR ESTADO AL SALIR
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

export default React.memo(ColorDetail);
