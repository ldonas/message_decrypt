import { CRTControl } from './CRTControl';
import { PropTypes } from 'prop-types';

export function CRTControlPanel({hue, setHUE, brightness, setBrightness, contrast, setContrast}){
    const windowWidth = window.innerWidth;

    return (
        <section className="crt-controls">
          <CRTControl key="HUE" min={0} max={360} isCyclic defValue={hue} setValue={setHUE}>HUE</CRTControl>
          {
            (windowWidth > 768) && 
            <>
              <CRTControl key="BRIGHTNESS" min={0} max={200} isCyclic={false} defValue={brightness} setValue={setBrightness}>Brillo</CRTControl>
              <CRTControl key="CONTRAST" min={0} max={200} isCyclic={false} defValue={contrast} setValue={setContrast}>Contraste</CRTControl>
            </>
          }
          <div className="RRSS">
            <a href="https://twitter.com/lorenzo_donas">
              <img src="icons/post-it-X.svg" width={50} height={50} alt="Imagen X" className=""/>
            </a>
            <a href="https://github.com/ldonas">
              <img src="icons/post-it-github.svg" width={50} height={50} alt="Imagen Github" className=""/>
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