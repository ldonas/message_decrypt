import { useState, useEffect } from 'react';
import { CRTControl } from './components/CRTControl';
import { CRTText } from './components/CRTText';
import { CRTInputDecrypt } from './components/CRTInput';
import './App.css';

function App() {
  const [hue, setHUE] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [showInput, setShowInput] = useState(false);
  const [initialDecryptKey, setInitialDecryptKey] = useState([['U','R','J','N','G','B','D','Q','O','E','S','L','W','Y'],['Y','L','I','M']]);
  const [decryptKey, setDecryptKey] = useState(initialDecryptKey);
  const [message, setMessage] = useState('O LSJYG NOBDSQO, BJWE RY OUSBO');
  const [tries, setTries] = useState(0);
  const [decryptMessage, setDecryptMessage] = useState("");
  const [solved, setSolved] = useState(false);
  const [help, setHelp] = useState(false);
  const windowWidth = window.innerWidth;
  const [messageDescription, setMessageDescription] = useState(" ");
  const helpDescription = ["Autor: Lorenzo Doñas Rodríguez", 
                            "Ayuda v1.0", 
                            "1. Introduzca la frase de desencriptado haciendo coincidir las letras encriptadas con las que usted piensa.",
                            "2. Una vez introducidas todas los caracteres, pulse Enter.",
                            "3. Se mostrará un conteo de intentos y el intento de desencriptado con la clave introducida.",
                            "4. Si la clave es correcta se mostrará la cantidad de fallos cometidos y una breve descripción de la frase.",
                            "5. Recuerda que la frase puede contener 'Ñ', pero no vocales con tilde."];

  useEffect(() => {
    const action = {action: "getPhrase"};
    fetch("phrases_interface.php", {
      method: "POST",
      body: JSON.stringify(action),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      response.json()
      .then(data => {
        const normalizedData = [...data];
        normalizedData[1] = normalizedData[1].split(" ");
        normalizedData[2] = normalizedData[2].split(" ");
        setMessage(normalizedData[0])
        setInitialDecryptKey([normalizedData[1], normalizedData[2]]);
        setDecryptKey([normalizedData[1], normalizedData[2]]);
      });
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
    });
  },[]);

  useEffect(() => {
    if(decryptKey[0].length > 0 && decryptKey[0].length == decryptKey[1].length){
      const post = {action: "checkPhrase", userKey: decryptKey[1].join(" ")};
      fetch("phrases_interface.php", {
        method: "POST",
        body: JSON.stringify(post),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        response.json()
        .then(data => {
          const normalizedData = [...data];
          setSolved(normalizedData[0]);
          setDecryptMessage(normalizedData[1]);
          if(normalizedData[0]){
            setMessageDescription(normalizedData[2]);
          }
          else{
            setTries(tries + 1);
            setDecryptKey(initialDecryptKey);
          }
        });
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
      });
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
          (!help && message != "") ? (
          <div className="crt-screen-container">
            <button className="crt-help-button" onClick={handleHelp}>?</button>
            <CRTText key={1} initialText={["Mensaje entrante...", message, "Introduzca clave de descifrado:", decryptKey[0].join(" ")]} setShowInput={setShowInput}/>
            {
              showInput && 
              <>
              <CRTInputDecrypt decryptKey={decryptKey} setDecryptKey={setDecryptKey}/>
              <CRTText key={2} initialText={(solved) ? [`Fallos: ${tries}`, `Desencriptado: ${decryptMessage}`, messageDescription] : [(tries > 0) ? `Intentos: ${tries}` : "", decryptMessage]} />
              </>
            }
          </div>
          )
          :
          <div className="crt-screen-container">
            <button className="crt-help-button" onClick={handleHelp}>X</button>
            <CRTText key={3} initialText={helpDescription} setShowInput={setShowInput}/>
          </div>
        }
      </section>
      {
        <section className="crt-controls">
          <CRTControl min={0} max={360} isCyclic={true} setValue={setHUE}>HUE</CRTControl>
          {
            (windowWidth > 768) && 
            <>
              <CRTControl min={0} max={200} defValue={brightness} isCyclic={false} setValue={setBrightness}>Brillo</CRTControl>
              <CRTControl min={0} max={200} defValue={contrast} isCyclic={false} setValue={setContrast}>Contraste</CRTControl>
            </>
          }
          <div className="RRSS" style={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
            <a href="https://twitter.com/lorenzo_donas">
              <img src="icons/post-it-X.svg" width={50} height={50} alt="Imagen X" className=""/>
            </a>
            <a href="https://github.com/ldonas">
              <img src="icons/post-it-github.svg" width={50} height={50} alt="Imagen Github" className=""/>
            </a>
          </div>
        </section>
      }
    </main>
  )
}

export default App
