import { useState, useEffect } from 'react'
import { CRTControlPanel } from './components/CRTControlPanel'
import { CRTText } from './components/CRTText'
import { CRTInputDecrypt } from './components/CRTInput'
import './App.css'

function App() {
  // Inicializamos el estado de la aplicación
  const [hue, setHUE] = useState(0)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [showInput, setShowInput] = useState(false)
  const [initialDecryptKey, setInitialDecryptKey] = useState([['U','R','J','N','G','B','D','Q','O','E','S','L','W','Y'],['Y','L','I','M']])
  const [decryptKey, setDecryptKey] = useState(initialDecryptKey)
  const [message, setMessage] = useState('O LSJYG NOBDSQO, BJWE RY OUSBO')
  const [tries, setTries] = useState(0)
  const [decryptMessage, setDecryptMessage] = useState("")
  const [solved, setSolved] = useState(false)
  const [help, setHelp] = useState(false)
  const [messageDescription, setMessageDescription] = useState(" ")

  //Definimos la ayuda en pantalla
  const helpDescription = [ 'Autor: Lorenzo Doñas Rodríguez', 
                            'Ayuda v1.0', 
                            '1. Introduzca la frase de desencriptado haciendo coincidir las letras encriptadas con las que usted piensa.',
                            '2. Una vez introducidas todas los caracteres, pulse Enter.',
                            '3. Se mostrará un conteo de intentos y el intento de desencriptado con la clave introducida.',
                            '4. Si la clave es correcta se mostrará la cantidad de fallos cometidos y una breve descripción de la frase.',
                            '5. Recuerda que la frase puede contener \'Ñ\', pero no vocales con tilde.',
                            'CRÉDITOS:',
                            'Refranes:', 
                            'https://cvc.cervantes.es',
                            'Fuentes:', 
                            'https://fonts.google.com/specimen/VT323',
                            'https://fonts.google.com/specimen/Allerta+Stencil'];

  // Obtenemos la frase del servidor
  useEffect(() => {
    const action = {action: 'getPhrase'};
    fetch('phrases_interface.php', {
      method: 'POST',
      body: JSON.stringify(action),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      response.json()
      .then(data => {
        // Normalizamos la frase para mostrarla en pantalla
        const normalizedData = [...data]
        normalizedData[1] = normalizedData[1].split(' ')
        normalizedData[2] = normalizedData[2].split(' ')
        // Guardamos los datos obtenidos
        setMessage(normalizedData[0])
        setInitialDecryptKey([normalizedData[1], normalizedData[2]])
        setDecryptKey([normalizedData[1], normalizedData[2]])
      })
    })
    .catch(() => {
      console.error('Error en la solicitud')
    })
  },[])

  // Cada vez que se introduzca una nueva clave de descifrado, comprobamos si es correcta enviándola al servidor
  useEffect(() => {
    if(decryptKey[0].length > 0 && decryptKey[0].length == decryptKey[1].length){
      const post = {action: 'checkPhrase', userKey: decryptKey[1].join(' ')}
      fetch('phrases_interface.php', {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        response.json()
        .then(data => {
          const fetchedData = [...data]
          // Guardamos el resultado de si la clave es correcta o no
          setSolved(fetchedData[0])
          // Guardamos el mensaje desencriptado y su descripción
          setDecryptMessage(fetchedData[1])
          if(fetchedData[0]){
            setMessageDescription(fetchedData[2])
          }
          // Si no es correcto aumentamos en 1 los fallos y reiniciamos la clave de descifrado
          else{
            setTries(tries + 1)
            setDecryptKey(initialDecryptKey)
          }
        });
      })
      .catch(() => {
        console.error('Error en la solicitud')
      })
    }
  }, [decryptKey])

  // Función para mostrar la ayuda en pantalla
  function handleHelp(){
    setHelp(!help);
    setShowInput(false);
  }

  return (
    <main className='crt__frame'>
      <section className="crt__screen" style={{filter: `brightness(${brightness}%) hue-rotate(${hue}deg) contrast(${contrast}%)`}}>
        <div className='crt__screen__container'>
          {
            (!help && message != '') ? (
            <>
              <button className='crt__screen__help-button' onClick={handleHelp}>?</button>
              <CRTText key='MESSAGE' initialText={['Mensaje entrante...', message, 'Introduzca clave de descifrado:', decryptKey[0].join(' ')]} setShowInput={setShowInput}/>
              {
                showInput && 
                <>
                <CRTInputDecrypt decryptKey={decryptKey} setDecryptKey={setDecryptKey}/>
                <CRTText key='TRIES' initialText={(solved) ? [`Fallos: ${tries}`, `Desencriptado: ${decryptMessage}`, `Significado: ${messageDescription}`] : [(tries > 0) ? `Intentos: ${tries}` : '', decryptMessage]} />
                </>
              }
            </>
            )
            :
            <>
              <button className='crt__screen__help-button' onClick={handleHelp}>X</button>
              <CRTText key='HELP' initialText={helpDescription} setShowInput={setShowInput}/>
            </>
          }
        </div>
      </section>
      <CRTControlPanel hue={hue} setHUE={setHUE} brightness={brightness} setBrightness={setBrightness} contrast={contrast} setContrast={setContrast} />
    </main>
  )
}

export default App
