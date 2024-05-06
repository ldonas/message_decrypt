<?php

// Generamos la semilla para el día actual
$seed = date('z') + date('Y');
$file_name = '../phrases/today_phrase.php';
$phrase = "";

// Si existe el archivo de la frase del día, la leemos
if(file_exists($file_name)){
    $phrase = read_phrase_file();
}
// Si no existe, la escribimos
else{
    $writed = write_phrase_file($phrase);
    $phrase = ($writed[0]) ? $writed[1] : read_phrase_file();
}

/**
 * Función para escribir la frase del día en el archivo
 * @return bool|array Fallo en la escritura | Frase del día
 */
function write_phrase_file() : bool | array{
    global $file_name, $seed;
    require_once '../phrases/phrases.php';
    $totalPhrases = count($phrases);
    $phraseIndex = $seed % $totalPhrases;
    $today_phrase = $phrases[$phraseIndex];
    $write = false;
    $file = fopen($file_name, 'w');
    // Si se puede bloquear el archivo, escribimos la frase del día
    if(flock($file, LOCK_EX | LOCK_NB)){
        fwrite($file, '<?php $today_seed = '.var_export($seed, true).'; $today_phrase = '.var_export($today_phrase, true).'; ?>');
        $write = [true, $today_phrase];
        flock($file, LOCK_UN);
    }

    return $write;
}

/**
 * Función para leer la frase del día del archivo
 * @return array [Frase del día, Frase cifrada, Letras desordenadas, Letras cifradas, Pista, Descripción]
 */
function read_phrase_file() : array{
    global $file_name, $seed;
    $readed_phrase = "";
    $file = fopen($file_name, 'r');
    // Si se puede bloquear el archivo, leemos la frase del día
    if(flock($file, LOCK_SH)){
        require_once $file_name;
        if($seed === $today_seed){
            $readed_phrase = $today_phrase;
        }
        else{
            $writed = write_phrase_file();
            $readed_phrase = ($writed[0]) ? $writed[1] : read_phrase_file();
        }
        flock($file, LOCK_UN);
    }
    return $readed_phrase;
}

/**
 * Función para obtener la frase del día
 * @return array [Frase del día, Letras desordenadas, Letras cifradas]
 */
function get_phrase() {
    global $phrase;
    return [
        $phrase[1],
        $phrase[3],
        $phrase[4],
    ];
}

/**
 * Función para comprobar si la frase introducida por el usuario es correcta
 * @param string $userKey Clave introducida por el usuario
 * @return array [La clave es correcta, Mensaje, Descripción] | [La clave no es correcta, Mensaje]
 */
function check_phrase($userKey) : array {
    global $phrase;
    $userArray = explode(" ", $userKey);
    // Convertimos la frase en un array de caracteres con mb_str_split para soportar caracteres especiales
    $messageArray = mb_str_split($phrase[1]);
    $cypherKey = explode(" ", $phrase[3]);
    $solved = false;
    // Recorremos el array de la frase y comparamos con el array de la clave
    for ($i=0; $i < count($messageArray); $i++) {
        $index = array_search($messageArray[$i], array_merge([" "], $cypherKey));
        $messageArray[$i] = ($index) ? $userArray[$index-1] : $messageArray[$i];
    }
    $message = implode("", $messageArray);
    if($userKey === $phrase[2]){
        $solved = true;
    }
    // Si la clave introducida es correcta devolvemos la descripción de la frase
    return ($solved) ? [$solved, $message, $phrase[5]] : [$solved, $message];
}

?>