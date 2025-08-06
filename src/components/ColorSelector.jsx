import React, { useRef, useEffect, useState, useCallback } from 'react';
import "./ColorSelector.css"
import { hsvToRgb, rgbToHex } from "../utils/colorConversions.js";
import { FaEyeDropper } from "react-icons/fa6";

export default function ColorSelector({ onColorChange }) {

    const [hsv, setHsv] = useState({ h: 0, s: 100, v: 100});
    
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);

    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)

    const colorPickerRef = useRef(null);
    const colorBarRef = useRef(null);

    const [isDraggingPicker, setIsDraggingPicker] = useState(false)
    const [isDraggingBar, setIsDraggingBar] = useState(false)

    const lastEmittedColorRef = useRef({ hsv, rgb, hex })

    const getPickerHandlePosition = useCallback(() => {
        if(!colorPickerRef.current) return { left: '300px', top: '0px'};
        const { width, height } = colorPickerRef.current.getBoundingClientRect();
        const x = (hsv.s / 100) * width;
        const y = (1 - (hsv.v / 100)) * height;
        return { left: `${x}px`, top: `${y}px`};
    }, [hsv])


    const getBarHandlePosition = useCallback(() => {
        if(!colorBarRef.current) return { left: '0px' };
        const { width } = colorBarRef.current.getBoundingClientRect();
        const x = (hsv.h / 360) * width;
        return { left: `${x}px`};
    }, [hsv]);

    const handlePickerMouseMove = useCallback((e) => {
        if(!isDraggingPicker || !colorPickerRef.current) return;

        const rect = colorPickerRef.current.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));

        const newS = parseFloat(((x / rect.width) * 100).toFixed(2));
        const newV = parseFloat(((1 - (y / rect.height)) * 100).toFixed(2));

        setHsv(prevHsv => ({ ...prevHsv, s: newS, v: newV }));

    }, [isDraggingPicker])

    const handleBarMouseMove = useCallback((e) => {
        if(!isDraggingBar || !colorBarRef.current) return;

        const rect = colorBarRef.current.getBoundingClientRect();
        let x = e.clientX - rect.left;
        
        x = Math.max(0, Math.min(x, rect.width));
        
        const newH = parseFloat(((x / rect.width) * 360).toFixed(2));

        setHsv(prevHsv => ({ ...prevHsv, h: newH }));
    }, [isDraggingBar])

    const handlePickerMouseDown = useCallback ((e) => {
        setIsDraggingPicker(true);
        handlePickerMouseMove(e);
    }, [handlePickerMouseMove])

    const handleBarMouseDown = useCallback((e) => {
        setIsDraggingBar(true);
        handleBarMouseMove(e);
    }, [handleBarMouseMove])

    const handleGlobalMouseUp = useCallback(() => {
        setIsDraggingPicker(false);
        setIsDraggingBar(false);
    }, []);

    useEffect(() => {
        if(isDraggingPicker || isDraggingBar) {
            document.addEventListener('mousemove', handlePickerMouseMove);
            document.addEventListener('mousemove', handleBarMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
        } else {
            document.removeEventListener('mousemove', handlePickerMouseMove);
            document.removeEventListener('mousemove', handleBarMouseMove)
            document.removeEventListener('mouseup', handleGlobalMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', handlePickerMouseMove);
            document.removeEventListener('mousemove', handleBarMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        }
    }, [isDraggingPicker, isDraggingBar, handlePickerMouseMove, handleBarMouseMove, handleGlobalMouseUp])

    useEffect(() => {
       const currentHsv = { h: parseFloat(hsv.h.toFixed(2)), s: parseFloat(hsv.s.toFixed(2)), v: parseFloat(hsv.v.toFixed(2)) };
            const currentRgb = { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
            const currentHex = hex; 

            const lastHsv = lastEmittedColorRef.current.hsv;
            const lastRgb = lastEmittedColorRef.current.rgb;
            const lastHex = lastEmittedColorRef.current.hex;

            const hsvChanged = currentHsv.h !== lastHsv.h || currentHsv.s !== lastHsv.s || currentHsv.v !== lastHsv.v;
            const rgbChanged = currentRgb.r !== lastRgb.r || currentRgb.g !== lastRgb.g || currentRgb.b !== lastRgb.b;
            const hexChanged = currentHex !== lastHex;

            if (hsvChanged || rgbChanged || hexChanged) {
                const newColorData = { hsv: currentHsv, rgb: currentRgb, hex: currentHex };
                onColorChange(newColorData);
                lastEmittedColorRef.current = newColorData;
            }
    }, [hsv, rgb, hex, onColorChange]);


    return(
        <div className="selectorContainer">
            <div
             className="colorPicker"
             ref={colorPickerRef}
             onMouseDown={handlePickerMouseDown}
             style={{backgroundColor: `hsl(${hsv.h}, 100%, 50%)`}}
            >
                <div
                 className="pickerSelector"
                 style={getPickerHandlePosition()}
                ></div>
            </div>
            <div
             className="colorBar"
             ref={colorBarRef}
             onMouseDown={handleBarMouseDown}
             >
                <div className="pickerSelector" style={getBarHandlePosition()}></div>
            </div>
            <button className='dropper' ><FaEyeDropper color={hex} size={16}/></button>
        </div>
    )
}