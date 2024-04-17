import { useState, useEffect} from "react";
import { PropTypes } from 'prop-types';

export function CRTText ({initialText, setShowInput = false}){
    let text = initialText;
    if(!Array.isArray(text))
        text = [text, ""];

    const [printedText, setPrintedText] = useState(Array(text.length).fill(""));

    useEffect(() => {
        if(printedText[0] != text[0])
            setPrintedText(Array(text.length).fill(""));
    }, [initialText]);
    
    useEffect(() => {
        let index = 0;
        while((printedText[index] == text[index] || text[index].length <= 0)&& index < text.length){
            index++;
        }
        if(index < text.length){
            const newPrintedText = [...printedText];
            newPrintedText[index] = text[index].substring(0, printedText[index].length + 1);
            newPrintedText[index] += newPrintedText[index].length < text[index].length ? "_" : "";
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