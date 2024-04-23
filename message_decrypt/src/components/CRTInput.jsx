import { useState, useEffect } from 'react'
import { PropTypes } from 'prop-types'

/**
 * Componente para la entrada de texto en el cifrado por sustitución
 * @param {string} decryptKey [Clave de cifrado, pista]
 * @param {function} setDecryptKey Función para actualizar la clave de cifrado 
 * 
 */
export function CRTInputDecrypt({decryptKey, setDecryptKey}){
    // Inicializamos el componente con los datos aportados
    const [inputText, setInputText] = useState(decryptKey[1].join(' ') + '_')
    const maxLength = decryptKey[0].length

    // Actualizamos el texto de entrada cuando se cambia la clave de cifrado
    useEffect(() => {
        setInputText(decryptKey[1].join(' ') + '_')
    }, [decryptKey])

    // Función para manejar los eventos de entrada de texto
    function handleChange(event){
        let inputKey = event.nativeEvent.data
        if(inputKey != null){
            // Comprobamos que el valor introducido sea un caracter válido (Una letra sin tilde o un número)
            inputKey = (inputKey.match(/[a-zA-Z0-9ñÑ]/)) ? inputKey.toUpperCase() : false
            // Transformamos el texto de entrada en un array
            const newInputKey = inputText.replaceAll('_', '').replaceAll('↲', '').split(' ')
            // Si el texto de entrada no está completo y no contiene el caracter introducido, añadimos el nuevo valor
            if(inputKey && newInputKey.length < maxLength && !newInputKey.join('').includes(inputKey)){
                newInputKey.push(inputKey)
                const newInputText = newInputKey.join(' ') + ((newInputKey.length < maxLength) ? '_' : ' ↲')
                setInputText(newInputText)
            }
        }
        // Si se ha eliminado un caracter, eliminamos el último valor del array
        else if(event.nativeEvent.inputType == 'deleteContentBackward'){
            let newInputKey = inputText.replaceAll('_', '').replaceAll(' ↲', '').split(' ')
            newInputKey.pop()
            if(newInputKey.length < decryptKey[1].length){
                newInputKey = [...decryptKey[1]]
            }
            const newInputText = newInputKey.join(' ') + ((newInputKey.length < decryptKey[0].length) ? '_' : '')
            setInputText(newInputText)
        }
    }

    // Si pulsamos enter, actualizamos la clave de cifrado
    function handleEnter(event){
        if(event.key == 'Enter'){
            const newDecryptKey = [...decryptKey]
            newDecryptKey[1] = inputText.replaceAll('_', '').replaceAll(' ↲', '').split(' ')
            if(newDecryptKey[1].length == newDecryptKey[0].length){
                setDecryptKey(newDecryptKey)
            }
        }
    }

    // Añadimos un indicador de posición al texto de entrada
    function handleFocus(){
        let newInputText = inputText.replaceAll('_', '')
        newInputText += (decryptKey[0].length > newInputText.replaceAll(' ', '').length) ? '_' : ' ↲'
        setInputText(newInputText)
    }

    // Eliminamos el indicador de posición al perder el foco
    function handleBlur(){
        const newInputText = inputText.replaceAll('_', '').replaceAll(' ↲', '')
        setInputText(newInputText)
    }

    return (
        <input 
            type='text' 
            className='crt__screen__input' 
            value={inputText} 
            onInput={handleChange} 
            onKeyDown={handleEnter} 
            onFocus={handleFocus} 
            onBlur={handleBlur} 
            autoFocus 
            autoComplete='false'
        />
    )
}
CRTInputDecrypt.propTypes = {
    decryptKey: PropTypes.array.isRequired,
    setDecryptKey: PropTypes.func.isRequired
}