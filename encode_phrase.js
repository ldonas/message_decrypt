//Para ejecutar este archivo en VSCode escribir "node encode_phrase.js" en la terminal
const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

function encodePhrase(phrase){
    const UpperPhrase = phrase.toUpperCase();
    const codeKey = generateCodeKey(phrase);
    const cypherKey = generateCypherKey(codeKey);
    const phraseArray = phrase.split("");
    let encodedPhrase = "";
    for(let i = 0; i < phraseArray.length; i++){
        if(letters.includes(phraseArray[i].toUpperCase())){
            const cypherChar = cypherKey[codeKey.indexOf(phraseArray[i].toUpperCase())];
            encodedPhrase += cypherChar;
        }
        else{
            encodedPhrase += phraseArray[i];
        }
    }
    const hint = [];
    let hintLength = Math.max(Math.floor(codeKey.length * 0.2), 3);

    for(let i = 0; i < hintLength; i++){
        hint.push(codeKey[i]);
    }

    return [UpperPhrase, encodedPhrase, codeKey.join(" "), cypherKey.join(" "), hint.join(" ")];
}

function generateCodeKey(phrase){
    const codeKey = [];
    const phraseArray = phrase.split("");
    for(let i = 0; i < phraseArray.length; i++){
        if(letters.includes(phraseArray[i].toUpperCase()) && !codeKey.includes(phraseArray[i].toUpperCase())){
            codeKey.push(phraseArray[i].toUpperCase());
        }
    }

    const result = shuffle(codeKey);

    return result;
}

function generateCypherKey(originalKey){
    let lettersPool = [...letters];
    const cypherKey = [];
    while(cypherKey.length < originalKey.length){
        const index = Math.floor(Math.random() * lettersPool.length);
        cypherKey.push(lettersPool[index]);
        lettersPool.splice(index, 1);
    }

    return cypherKey;
}

function shuffle(arrayData){
    const shuffledArray = [];
    while(arrayData.length > 0){
        const index = Math.floor(Math.random() * arrayData.length);
        shuffledArray.push(arrayData[index]);
        arrayData.splice(index, 1);
    }

    return shuffledArray;
}
const input = process.argv[2];
console.log(encodePhrase(input));