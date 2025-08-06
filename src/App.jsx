import './App.css'
import { useState, useCallback } from 'react'
import Logo from './assets/colorpicker.png'
import ColorDetail from './components/ColorDetail.jsx'
import ColorSelector from './components/ColorSelector.jsx'  

function App() {

  const [color, setColor] = useState({
    hsv: { h: 0, s: 100, v: 100},
    rgb: { r: 255, g: 0, b: 0},
    hex: "#FF0000"
  });

  const handleColorChange = useCallback((newColor) =>{
    setColor(newColor);
  }, [])

  return (
    <>
      <main className='mainApp'>

        <section
          style={{
            filter: `drop-shadow(2px 2px 2px ${color.hex})`
          }}
        >
          <h1>Color Picker</h1>
        </section>

        <div className='container'
          style={{
            border: '1px solid '+ color.hex,
            padding: '40px',
            borderRadius: '15px',
          }}
        >
          <ColorDetail color={color} />
          <ColorSelector onColorChange={handleColorChange} />
        </div>

      </main>
    </>
  )
}

export default App
