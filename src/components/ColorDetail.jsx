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
      if (editingInput === type) return inputValue;
      if (type === "hex") return color.hex;
      if (type === "rgb") return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
      if (type === "hsv") return `hsv(${displayHsv.h}, ${displayHsv.s}%, ${displayHsv.v}%)`;
      return "";
    },
    [editingInput, inputValue, color, displayHsv]
  );

  const emitColorChange = (colorString) => {
    const colorInstance = colord(colorString);
    if (!colorInstance.isValid()) return;

    const hsv = colorInstance.toHsv();
    const rgb = colorInstance.toRgb();

    onColorChange({
      hsv: { h: Math.round(hsv.h), s: Math.round(hsv.s), v: Math.round(hsv.v) },
      rgb: { r: rgb.r, g: rgb.g, b: rgb.b },
      hex: colorInstance.toHex().toUpperCase(),
    });
  };

  const handleChange = (e, type, validatorFn, formatFn) => {
    const value = e.target.value;
    setEditingInput(type);
    setInputValue(value);
    if (validatorFn(value)) {
      emitColorChange(formatFn ? formatFn(value) : value);
    }
  };

  const handleCopy = useCallback(async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error("Error al intentar copiar:", err);
    }
  }, []);

  const renderInputGroup = (label, type, validator, formatter) => (
    <div className="input-group">
      <div className="label-cell">
        <div className="status-dot" />
        <p>{label}</p>
      </div>
      <div className="input-cell">
        <input
          type="text"
          spellCheck="false"
          value={getInputValue(type)}
          onChange={(e) => handleChange(e, type, validator, formatter)}
          onBlur={() => {
            setEditingInput(null);
            setInputValue("");
          }}
        />
        <button
          className="copy-button"
          onClick={() => handleCopy(getInputValue(type))}
          title={`Copy ${label}`}
        >
          <FaRegCopy color="var(--accent-color)" size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="color-info">
      <div
        className="color-preview-box"
        style={{ backgroundColor: color.hex }}
        onClick={() => handleCopy(color.hex)}
        title="Click to copy HEX"
      />

      <div className="color-data-grid">
        {renderInputGroup(
          "HEX",
          "hex",
          (v) => /^#?([0-9A-F]{3}){1,2}$/i.test(v),
          (v) => (v.startsWith("#") ? v : `#${v}`)
        )}

        {renderInputGroup(
          "RGB",
          "rgb",
          (v) => v.split(",").length === 3,
          (v) => v.includes("rgb") ? v : `rgb(${v})`
        )}

        {renderInputGroup(
          "HSV",
          "hsv",
          (v) => v.split(",").length === 3,
          (v) => v.includes("hsv") ? v : `hsv(${v})`
        )}
      </div>
    </div>
  );
}

export default React.memo(ColorDetail);

