import { CRTControl } from './CRTControl'
import { PropTypes } from 'prop-types'

/**
 * Contenedor de controles de la pantalla CRT
 * @param {number} hue Valor inicial de HUE
 * @param {function} setHUE Función que se ejecutará cada vez que se actualice el valor de HUE
 * @param {number} brightness Valor inicial de Brillo
 * @param {function} setBrightness Función que se ejecutará cada vez que se actualice el valor de Brillo
 * @param {number} contrast Valor inicial de Contraste
 * @param {function} setContrast Función que se ejecutará cada vez que se actualice el valor de Contraste 
 * @returns 
 */
export function CRTControlPanel({hue, setHUE, brightness, setBrightness, contrast, setContrast}){
    const windowWidth = window.innerWidth
    
    return (
        <section className='crt__frame__panel'>
          <CRTControl key='HUE' min={0} max={360} isCyclic defValue={hue} setValue={setHUE}>HUE</CRTControl>
          {
            // Solo mostramos los controles de brillo y contraste en pantallas grandes
            (windowWidth > 768) && 
            <>
              <CRTControl key='BRIGHTNESS' min={0} max={200} isCyclic={false} defValue={brightness} setValue={setBrightness}>Brillo</CRTControl>
              <CRTControl key='CONTRAST' min={0} max={200} isCyclic={false} defValue={contrast} setValue={setContrast}>Contraste</CRTControl>
            </>
          }
          <div className='crt__frame__panel__rrss'>
            <a href='https://twitter.com/lorenzo_donas'>
              <img src='icons/post-it-X.svg' width={50} height={50} alt='Imagen X'/>
            </a>
            <a href='https://github.com/ldonas'>
              <img src='icons/post-it-github.svg' width={50} height={50} alt='Imagen Github'/>
            </a>
          </div>
        </section>
    )
}
CRTControlPanel.propTypes = {
  hue: PropTypes.number.isRequired,
  setHUE: PropTypes.func.isRequired,
  brightness: PropTypes.number.isRequired,
  setBrightness: PropTypes.func.isRequired,
  contrast: PropTypes.number.isRequired,
  setContrast: PropTypes.func.isRequired
}