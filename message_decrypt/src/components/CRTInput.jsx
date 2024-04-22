import { useState, useEffect } from "react";
import { PropTypes } from 'prop-types';

export function CRTInputDecrypt({decryptKey, setDecryptKey}){
    const [inputText, setInputText] = useState(decryptKey[1].join(" ") + "_");
    const maxLength = decryptKey[0].length;

    useEffect(() => {
        setInputText(decryptKey[1].join(" ") + "_");
    }, [decryptKey]);

    function handleChange(event){
        let inputKey = event.nativeEvent.data;
        if(inputKey != null){
            inputKey = (inputKey.match(/[a-zA-Z0-9ñÑ]/)) ? inputKey.toUpperCase() : false;
            const newInputKey = inputText.replaceAll(" ", "").replaceAll("_", "").replaceAll("↲", "").split("");
            if(inputKey && newInputKey.length < decryptKey[0].length){
                if(newInputKey.length < maxLength && !newInputKey.join("").includes(inputKey)){
                    newInputKey.push(inputKey);
                const newInputText = newInputKey.join(" ") + ((newInputKey.length < decryptKey[0].length) ? "_" : " ↲");
                setInputText(newInputText);
                }
            }
        }
        else if(event.nativeEvent.inputType == "deleteContentBackward"){
            let newInputKey = inputText.replaceAll(" ", "").replaceAll("_", "").replaceAll("↲", "").split("");
            newInputKey.pop();
            if(newInputKey.length < decryptKey[1].length){
                newInputKey = [...decryptKey[1]];
            }
            const newInputText = newInputKey.join(" ") + ((newInputKey.length < decryptKey[0].length) ? "_" : "");
            setInputText(newInputText);
        }
    }

    function handleEnter(event){
        if(event.key == "Enter"){
            const newDecryptKey = [...decryptKey];
            newDecryptKey[1] = inputText.replaceAll(" ", "").replaceAll("_", "").replaceAll("↲", "").split("");
            if(newDecryptKey[1].length == newDecryptKey[0].length){
                setDecryptKey(newDecryptKey);
            }
        }
    }

    function handleFocus(){
        let newInputText = inputText.replaceAll("_", "");
        newInputText += (decryptKey[0].length > newInputText.replaceAll(" ", "").length) ? "_" : " ↲";
        setInputText(newInputText);
    }

    function handleBlur(){
        const newInputText = inputText.replaceAll("_", "").replaceAll(" ↲", "");
        setInputText(newInputText);
    }

    return (<input type="text" className="crt-input" value={inputText} onInput={handleChange} onKeyDown={handleEnter} onFocus={handleFocus} onBlur={handleBlur} autoFocus autoComplete="false"/>);
}
CRTInputDecrypt.propTypes = {
    decryptKey: PropTypes.array.isRequired,
    setDecryptKey: PropTypes.func.isRequired
}