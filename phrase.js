const phrase = "O LSJYG NOBDSQO, BJWE RY OUSBO";
const decryptKey1 = ["U","R","J","N","G","B","D","Q","O","E","S","L","W","Y"];
const decryptKey2 = ["Y","L","I","M"];
const solution = ["Y","L","I","M","N","D","R","G","A","S","U","Q","O","E"];
const message = "Refrán español que recomienda ser diligente para tener éxito en las pretensiones laborales.";

export function GetPhrase(){
    return [phrase, decryptKey1, decryptKey2, message];
}

export function isSolved(decryptKey){
    if(decryptKey.length != solution.length)
        return false;

    for(let i = 0; i < solution.length; i++){
        if(decryptKey[i] != solution[i])
        {
            return false;
        }
    }

    return true;
}