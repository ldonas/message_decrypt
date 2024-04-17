import { useState, useEffect } from 'react';
import { CRTControl } from './components/CRTControl';
import { CRTText } from './components/CRTText';
import { CRTInputDecrypt } from './components/CRTInput';
import { GetPhrase, isSolved } from '../../phrase';
import './App.css';

function App() {
  const phrase = GetPhrase();
  const [hue, setHUE] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [showInput, setShowInput] = useState(false);
  const [initialDecryptKey] = useState([phrase[1], phrase[2]]);
  const [decryptKey, setDecryptKey] = useState(initialDecryptKey);
  const [message] = useState(phrase[0]);
  const [tries, setTries] = useState(0);
  const [decryptMessage, setDecryptMessage] = useState("");
  const [solved, setSolved] = useState(false);
  const [help, setHelp] = useState(false);
  const windowWidth = window.innerWidth;
  const messageDescription = phrase[3];
  const helpDescription = ["Autor: Lorenzo Doñas Rodríguez", 
                            "Ayuda v1.0", 
                            "1. Introduzca la frase de desencriptado haciendo coincidir las letras encriptadas con las que usted piensa.",
                            "2. Una vez introducidas todas los caracteres, pulse Enter.",
                            "3. Se mostrará un conteo de intentos y el intento de desencriptado con la clave introducida.",
                            "4. Si la clave es correcta se mostrará la cantidad de fallos cometidos y una breve descripción de la frase."];

  useEffect(() => {
    if(decryptKey[0].length == decryptKey[1].length){
      const newDecryptMessage = message.split("");
      for(let i = 0; i < newDecryptMessage.length; i++){
        const keyIndex = decryptKey[0].indexOf(newDecryptMessage[i]);
        if(keyIndex >= 0){
          newDecryptMessage[i] = decryptKey[1][keyIndex];
        }
      }
      setDecryptMessage(newDecryptMessage.join(""));
      if(isSolved(decryptKey[1])){
        setSolved(true);
      }
      else {
        setTries(tries + 1);
        setDecryptKey(initialDecryptKey);
      }
    }
  }, [decryptKey]);

  function handleHelp(){
    setHelp(!help);
    setShowInput(false);
  }

  return (
    <main className='crt-frame'>
      <section className="crt-screen" style={{filter: `brightness(${brightness}%) hue-rotate(${hue}deg) contrast(${contrast}%)`}}>
        {
          !help ? (
          <div className="crt-screen-container">
            {
              showInput &&
              <button className="crt-help-button" onClick={handleHelp}>?</button>
            }
            <CRTText initialText={["Mensaje entrante...", message, "Introduzca clave de descifrado:", decryptKey[0].join(" ")]} setShowInput={setShowInput}/>
            {
              showInput && 
              <CRTInputDecrypt decryptKey={decryptKey} setDecryptKey={setDecryptKey}/>
            }
            <CRTText initialText={(solved) ? [`Fallos: ${tries}`, `Desencriptado: ${decryptMessage}`, messageDescription] : [(tries > 0) ? `Intentos: ${tries}` : "", decryptMessage]} />
          </div>
          )
          :
          <div className="crt-screen-container">
            {
              showInput &&
              <button className="crt-help-button" onClick={handleHelp}>X</button>
            }
            <CRTText initialText={helpDescription} setShowInput={setShowInput}/>
          </div>
        }
      </section>
      {
        (windowWidth > 768) &&
        <section className="crt-controls">
          <CRTControl min={0} max={360} isCyclic={true} setValue={setHUE}>HUE</CRTControl>
          <CRTControl min={0} max={200} defValue={170} isCyclic={false} setValue={setBrightness}>Brillo</CRTControl>
          <CRTControl min={0} max={200} defValue={100} isCyclic={false} setValue={setContrast}>Contraste</CRTControl>
        </section>
      }
    </main>
  )
}

export default App
