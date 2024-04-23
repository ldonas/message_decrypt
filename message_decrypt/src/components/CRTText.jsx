import { useState, useEffect} from 'react'
import { PropTypes } from 'prop-types'

/**
 * Componente para mostrar texto en pantalla con efecto CRT
 * @param {array<string>} initialText Líneas de texto a mostrar
 * @param {function} setShowInput Función para mostrar el input 
 * 
 */
export function CRTText ({initialText, setShowInput = false}){
    // Inicializamos el estado del componente
    const [printedText, setPrintedText] = useState(Array(initialText.length).fill(''))
    const arrayText = [...initialText]
    
    // Función para imprimir el texto en pantalla caracter a caracter
    useEffect(() => {
        let index = 0

        // Si se ha completado la línea actual, pasamos a la siguiente
        while((arrayText[index] ?? false) && (printedText[index] == arrayText[index] || arrayText[index].length <= 0) && index < arrayText.length){
            index++
        }

        // Mientras haya texto que imprimir y no se haya completado la línea actual, seguimos imprimiendo
        if(index < arrayText.length && index < printedText.length){
            const newPrintedText = [...printedText]
            newPrintedText[index] = arrayText[index].substring(0, printedText[index].length + 1)
            newPrintedText[index] += newPrintedText[index].length < arrayText[index].length ? '_' : ''
            setTimeout(() => {setPrintedText(newPrintedText)}, 150)
        }
        // Si se ha completado el texto, mostramos el input
        else if(setShowInput)
            setShowInput(true)
    }, [printedText])

    return(
        printedText.map((line, index) => {
            return ((line.length > 0) ? <p key={index} className='crt__screen__text'>{line}</p> : null)
        })
    )
}
CRTText.propTypes = {
    initialText: PropTypes.array.isRequired,
    setShowInput: PropTypes.func
}