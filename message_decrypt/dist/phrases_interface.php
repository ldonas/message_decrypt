<?php

require_once("../../phrases_functions.php");

// Obtén el contenido JSON
$json = file_get_contents('php://input');

// Decodifica los datos JSON
$data = json_decode($json, true);

// Verifica la acción a realizar
if($data["action"] == "getPhrase") {
    // Obtiene la frase encriptada, la clave de cifrado y la pista y la envía como respuesta
    $phrase = get_phrase();
    header("Content-Type: application/json");
    echo json_encode($phrase);
}
if($data["action"] == "checkPhrase" && isset($data["userKey"])){
    // Compara la clave introducida por el usuario con la clave correcta e intenta desencriptar la frase
    $result = check_phrase($data["userKey"]);
    header("Content-Type: application/json");
    echo json_encode($result);
}

?>