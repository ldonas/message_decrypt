import { useState, useEffect} from 'react'
import { PropTypes } from 'prop-types'
import { SaveData, LoadData } from '../logic/saveData'

/** Componente que permite controlar un valor numérico mediante un botón radial.
* 
* @param string children: Texto que se mostrará en pantalla.
* @param number min: Valor mínimo del rango del valor numérico.
* @param number max: Valor máximo del rango del valor numérico.
* @param number defValue: Valor por defecto del botón radial.
* @param boolean isCyclic: Indica si el valor numérico es cíclico.
* @param function setValue: Función que se ejecutará cada vez que se actualice el valor numérico.
*/
export function CRTControl ({children, min, max, defValue=0, isCyclic, setValue}){
    // Inicializamos el ángulo del botón
    const [angle, setAngle] = useState(() => {
        const angle = LoadData(children)
        return angle || denormalize(defValue, min, max, isCyclic)
    })
    // Inicializamos el estado de click en el botón
    const [clicked, setClicked] = useState(false)

    // Función que se ejecuta cuando se presiona el botón radial, y que establece la posición inicial del mouse
    function BeginRotation(){
        setClicked(true)
    }
    
    // Función que se ejecuta cuando se mueve el mouse, y que establece la rotación del botón radial
    function SetRotation(event){
        if(clicked){
            // Obtenemos las propiedades del botón
            const element = event.target
            // Obtenemos la posición del mouse dentro del botón y calculamos el ángulo
            const mouseX = (element.getBoundingClientRect().x + element.getBoundingClientRect().width / 2) - event.clientX
            const mouseY = (element.getBoundingClientRect().y + element.getBoundingClientRect().height / 2) - event.clientY
            // Calculamos el ángulo en radianes
            let newAngle = Math.atan2(mouseY, mouseX)
            // Convertimos el ángulo a grados y lo normalizamos en 360 grados
            newAngle = newAngle * (180 / Math.PI)
            // Esta línea evita que el control de un salto desde 180 a 0
            newAngle = (!isCyclic && newAngle < 0) ? angle : newAngle
            newAngle %= 360
            // Limitamos el ángulo del botón si tenemos que hacerlo
            newAngle = (isCyclic) ? newAngle : Math.max(0, Math.min(180, newAngle))
            // Actualizamos el ángulo del botón y guardamos los datos
            setAngle(newAngle)
            SaveData(children, newAngle)
        }
    }

    // Actualizamos el valor numérico cada vez que se actualice el ángulo del botón
    useEffect(() => {
        const n = normalize(angle, min, max, isCyclic)
        setValue(n)
    }, [angle])

    // Función que se ejecuta cuando se suelta el botón del mouse, y que establece el estado de click en falso
    function EndRotation(){
        setClicked(false)
    }

    return (
        <section className='crt__frame__panel__control'>
            <div className='crt__frame__panel__radial-button__background'>
                <img 
                    src='icons/radial-control.svg' 
                    alt='Botón radial' 
                    style={{transform: `rotate(${angle}deg)`}}
                    onMouseDown={BeginRotation} 
                    onPointerDown={BeginRotation}
                    onMouseMove={SetRotation} 
                    onPointerMove={SetRotation}
                    onMouseUp={EndRotation}
                    onMouseLeave={EndRotation}
                    onPointerUp={EndRotation}
                    draggable='false'
                    className='crt__frame__panel__radial-button__img'
                />
            </div>
            <p className='crt__frame__panel__control__text'>{children}</p>
        </section>
    )
}
CRTControl.propTypes = {
    children: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    defValue: PropTypes.number,
    isCyclic: PropTypes.bool,
    setValue: PropTypes.func
}

/**
 * Función que normaliza el valor dado dentro de un rango
 * @param {number} x Valor a normalizar
 * @param {number} min Valor mínimo del rango
 * @param {number} max Valor máximo del rango
 * @param {boolean} isCyclic Indica si el rango son 360 grados
 * @returns {number} Valor normalizado
 */
function normalize(x, min, max, isCyclic){
    let normalized = Math.max(min, (Math.min(x, max)))
    normalized /= (isCyclic) ? 360 : 180
    normalized = min + (max - min) * normalized
    return normalized
}

/**
 * Función que devuelve el ángulo de rotación del control en función de su valor normalizado
 * @param {number} x Valor a desnormalizar
 * @param {number} min Valor mínimo del rango
 * @param {number} max Valor máximo del rango
 * @param {boolean} isCyclic Indica si el rango son 360 grados
 * @returns {number} Ángulo de rotación
 */
function denormalize(x, min, max, isCyclic){
    const angleRange = (isCyclic) ? 360 : 180
    const valueRange = max - min
    let denormalize = angleRange * (x / valueRange)
    return denormalize
}