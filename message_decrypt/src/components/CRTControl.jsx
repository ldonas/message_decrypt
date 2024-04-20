import { useState, useEffect} from "react";
import { PropTypes } from 'prop-types';
import { SaveData, LoadData } from "../logic/saveData";

export function CRTControl ({children, min, max, defValue=0, isCyclic, setValue}){
    const [angle, setAngle] = useState(() => {
        const angle = LoadData(children);
        return angle || denormalize(defValue, min, max, isCyclic);
    });
    const [clicked, setClicked] = useState(false);

    function BeginRotation(){
        setClicked(true);
    }
    
    function SetRotation(event){
        if(clicked){
            const element = event.target;
            const mouseX = event.clientX - (element.getBoundingClientRect().x + element.getBoundingClientRect().width / 2);
            const mouseY = event.clientY - (element.getBoundingClientRect().y + element.getBoundingClientRect().height / 2);
            let newAngle = Math.atan2(mouseY, mouseX) * 180 / Math.PI;
            newAngle = (newAngle + 360 + 180) % 360;
            newAngle = (isCyclic) ? newAngle : Math.max(0, Math.min(180, newAngle));
            setAngle(newAngle);
            SaveData(children, newAngle);
        }
    }

    useEffect(() => {
        const n = normalize(angle, min, max, isCyclic);
        setValue(n);
    }, [angle]);

    function EndRotation(){
        setClicked(false);
    }

    return (
        <section className="crt-control">
            <div className="crt-radial-button__3d">
                <img 
                    src="icons/radial-control.svg" 
                    alt="Botón radial" 
                    style={{transform: `rotate(${angle}deg)`}}
                    onMouseDown={BeginRotation} 
                    onMouseMove={SetRotation} 
                    onMouseUp={EndRotation}
                    onMouseLeave={EndRotation} 
                    draggable="false"
                    className="crt-radial-button"
                />
            </div>
            <p className="crt-button-text">{children}</p>
        </section>
    );
}
CRTControl.propTypes = {
    children: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    defValue: PropTypes.number,
    isCyclic: PropTypes.bool,
    setValue: PropTypes.func
}

function normalize(x, min, max, isCyclic){
    let normalized = Math.max(min, (Math.min(x, max)));
    normalized /= (isCyclic) ? 360 : 180;
    normalized = min + (max - min) * normalized;
    return normalized;
}

function denormalize(x, min, max, isCyclic){
    const angleRange = (isCyclic) ? 360 : 180;
    const valueRange = max - min;
    let denormalize = angleRange * (x / valueRange);
    return denormalize;
}