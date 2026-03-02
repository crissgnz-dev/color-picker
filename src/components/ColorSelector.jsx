import React, { useCallback } from "react";
import { HexColorPicker } from "react-colorful";
import useEyeDropper from "use-eye-dropper";
import { FaEyeDropper } from "react-icons/fa6";
import "./ColorSelector.css";
import { colord } from "colord";

function EyeDropperButton({ hex, onChange }) {
  const { open, isSupported } = useEyeDropper();

  const handleEyeDropper = useCallback(async () => {
    if (!isSupported()) return;
    try {
      const { sRGBHex } = await open();
      onChange(sRGBHex);
    } catch (e) {
      console.error("error dropper:", e);
    }
  }, [open, isSupported, onChange]);

  return (
    <div className="dropper-wrapper">
      <button
        className="dropper-button"
        onClick={handleEyeDropper}
        disabled={!isSupported()}
        title="Extract color from screen"
      >
        <FaEyeDropper color="var(--accent-color)" size={20} />
      </button>
    </div>
  );
}

export default function ColorSelector({ hex, onChange }) {
  const handleColorChange = useCallback(
    (newHex) => {
      const colorInstance = colord(newHex);
      const hsv = colorInstance.toHsv();
      const rgb = colorInstance.toRgb();
      onChange({
        hsv: { h: Math.round(hsv.h), s: Math.round(hsv.s), v: Math.round(hsv.v) },
        rgb: { r: rgb.r, g: rgb.g, b: rgb.b },
        hex: colorInstance.toHex().toUpperCase(),
      });
    },
    [onChange]
  );

  return (
    <div className="selector-container">
      <HexColorPicker
        color={hex}
        onChange={handleColorChange}
      />
      <EyeDropperButton hex={hex} onChange={handleColorChange} />
    </div>
  );
}

