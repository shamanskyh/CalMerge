<?php

include_once("../config.php");

$URL = $_POST["address"];
$name = $_POST["name"];
$color = $_POST["color"];

$URL = str_replace("webcal://", "https://", $URL);

$stmt = $db->prepare('INSERT INTO Calendars (URL, Name, Color) VALUES (?, ?, ?)');
$stmt->bind_param('sss', $URL, $name, $color);
$stmt->execute();
echo($db->insert_id);
$stmt->close();

?>