import { FaRegCopy } from "react-icons/fa";
import "./ColorDetail.css";

export default function ColorDetail({ color }) {
    return (
        <div className='colorInfo'>


            <div className="cajaColor"
                 style={{
                    backgroundColor: color.hex
                 }}  
            />


            <div className='colorData'>

              <div className="info" style={{ border: '1px solid ' + color.hex }}> 
                <div>
                    <div className="circle" style={{ backgroundColor: color.hex }}/>
                    <p>HEX</p>
                </div>
                <div style={{ borderLeft: '1px solid ' + color.hex }}>
                    <p>{color.hex}</p>
                    <button><FaRegCopy color={color.hex} size={16}/></button>
                </div>
              </div>
              
              
              <div className="info" style={{ border: '1px solid ' + color.hex }}> 
                <div>
                    <div className="circle" style={{ backgroundColor: color.hex }}/>
                    <p>RGB</p>
                </div>
                <div style={{ borderLeft: '1px solid ' + color.hex }}>
                    <p>rgb({color.rgb.r} {color.rgb.g} {color.rgb.b})</p>
                    <button><FaRegCopy color={color.hex} size={16}/></button>
                </div>
              </div>
              
              
              <div className="info" style={{ border: '1px solid ' + color.hex }}> 
                <div>
                    <div className="circle" style={{ backgroundColor: color.hex }}/>
                    <p>HSV</p>
                </div>
                <div style={{ borderLeft: '1px solid ' + color.hex }}>
                    <p>hsv({color.hsv.h} {color.hsv.s} {color.hsv.v})</p>
                    <button><FaRegCopy color={color.hex} size={16}/></button>
                </div>
              </div>

            </div>
        </div>
    )
}