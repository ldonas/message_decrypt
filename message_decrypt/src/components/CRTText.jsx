import { useState, useEffect} from "react";
import { PropTypes } from 'prop-types';

export function CRTText ({initialText, setShowInput = false}){
    let arrayText = [];
    if(Array.isArray(initialText))
        arrayText = initialText;
    else
        arrayText = [initialText];

    const [printedText, setPrintedText] = useState(Array(arrayText.length).fill(""));

    useEffect(() => {
        if(printedText[0] != arrayText[0])
            setPrintedText(Array(arrayText.length).fill(""));
    }, [initialText]);
    
    useEffect(() => {
        let index = 0;

        while((arrayText[index] ?? false) && (printedText[index] == arrayText[index] || arrayText[index].length <= 0) && index < arrayText.length){
            index++;
        }
        if(index < arrayText.length && index < printedText.length){
            const newPrintedText = [...printedText];
            newPrintedText[index] = arrayText[index].substring(0, printedText[index].length + 1);
            newPrintedText[index] += newPrintedText[index].length < arrayText[index].length ? "_" : "";
            setTimeout(() => {setPrintedText(newPrintedText)}, 150);
        }
        else if(setShowInput)
            setShowInput(true);
    }, [printedText]);

    return(
        printedText.map((line, index) => {
            return ((line.length > 0) ? <p key={index} className="crt-text">{line}</p> : null);
        })
    );
}
CRTText.propTypes = {
    initialText: PropTypes.array.isRequired,
    setShowInput: PropTypes.func
}