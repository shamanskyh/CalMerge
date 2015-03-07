<?php

include_once("../config.php");

$name = isset($_POST["name"]) ? $_POST["name"] : "Untitled Calendar";
$length = 100;
$secure = TRUE;
$key = bin2hex(openssl_random_pseudo_bytes($length, $secure));

$stmt = $db->prepare('INSERT INTO Viewers (Name, Token) VALUES (?, ?)');
$stmt->bind_param('ss', $name, $key);
$stmt->execute();
$insertedID = $db->insert_id;
$stmt->close();

$stmt = $db->prepare('SELECT ID, URL, Name, Color FROM Calendars');
$stmt->execute();
$stmt->bind_result($ID, $URL, $name, $color);
$calendars = array();
while ($stmt->fetch()){
	$cal = array();
	$cal["id"] = $ID;
	$cal["URL"] = $URL;
	$cal["name"] = $name;
	$cal["color"] = $color;
	array_push($calendars, $cal);
}

$output = array();
$output["id"] = strval($insertedID);
$output["key"] = $key;
$output["calendars"] = $calendars;
$output["sharePrefix"] = $sharePrefix;

echo(json_encode($output));


?>