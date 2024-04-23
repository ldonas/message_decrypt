<?php

$phrases = [
    [ //1
        'A QUIEN MADRUGA, DIOS LE AYUDA', //Frase correcta
        'O LSJYG NOBDSQO, BJWE RY OUSBO', //Frase cifrada
        'Y L I M N D R G A S U Q O E', //Letras de la frase desordenadas
        'U R J N G B D Q O E S L W Y', //Letras cifradas
        'Y L I M', //Pista
        'Refrán español que recomienda ser diligente para tener éxito en las pretensiones laborales.' //Descripción o información sobre la frase
    ],
    [ //2
        'MAS VALE ESTAR SOLO QUE MAL ACOMPAÑADO',
        'UTX FTKY YXITV XCKC ANY UTK TJCULTMTPC',
        'V M U Ñ T O Q D R C L A P E S',
        'F U N M I C A P V J K T L Y X',
        'V M U',
        'Refrán español que recomienda ser selectivo en la elección de compañías.'
    ],
    [ //3
        'PERRO LADRADOR POCO MORDEDOR',
        'LBIIG OXEIXEGI LGNG SGIEBEGI',
        'D A C R O L P E M',
        'E X N I G O L B S',
        'D A C',
        'Refrán español que recomienda no temer a las personas que hablan mucho.'
    ]
];

// Obtenemos el total de frases
$totalPhrases = count($phrases);

//Usamos la suma de año y dia del año para obtener un indice de frase
$phraseIndex = (date('Y') + date('z')) % $totalPhrases;

/**
 * Obtiene la frase encriptada, la clave de cifrado y la pista
 * @return array<string> [Frase encriptada, Clave de cifrado, Pista]
 */
function get_phrase() : array {
    global $phrases, $phraseIndex;
    $phrase = $phrases[$phraseIndex];
    return [
        $phrase[1],
        $phrase[3],
        $phrase[4],
    ];
}

/**
 * Compara la clave introducida por el usuario con la clave correcta e intenta desencriptar la frase.
 * @param string $userKey Clave introducida por el usuario
 * @return array<string> [Resultado de la comparación, Frase desencriptada, Información adicional]
 */
function check_phrase(string $userKey) : array{
    global $phrases, $phraseIndex;
    $phrase = $phrases[$phraseIndex];
    // Comparamos las claves
    $solved = $userKey === $phrase[2];
    
    
    // Convertimos la frase en un array de caracteres con mb_str_split para evitar problemas con caracteres especiales
    $messageArray = mb_str_split($phrase[1]);
    $userArray = explode(" ", $userKey);
    $cypherKey = explode(" ", $phrase[3]);
    for ($i=0; $i < count($messageArray); $i++) {
        $index = array_search($messageArray[$i], array_merge([" "], $cypherKey));
        $messageArray[$i] = ($index) ? $userArray[$index-1] : $messageArray[$i];
    }
    $message = implode("", $messageArray);

    // Devolvemos el resultado
    return ($solved) ? [$solved, $message, $phrase[5]] : [$solved, $message];
}

?>