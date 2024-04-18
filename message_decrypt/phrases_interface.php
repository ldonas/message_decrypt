<?php

require_once("../../phrases_bd.php");

// Obtén el contenido JSON
$json = file_get_contents('php://input');

// Decodifica los datos JSON
$data = json_decode($json, true);

if($data["action"] == "getPhrase") {
    $phrase = getPhrase();
    header("Content-Type: application/json");
    echo json_encode($phrase);
}
if($data["action"] == "checkPhrase" && isset($data["userKey"])){
    $result = checkPhrase($data["userKey"]);
    header("Content-Type: application/json");
    echo json_encode($result);
}

?>