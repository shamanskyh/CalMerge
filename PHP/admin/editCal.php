<?php

include_once("../config.php");

$ID = isset($_POST["ID"]) ? $_POST["ID"] : "-1";
$URL = isset($_POST["URL"]) ? $_POST["URL"] : "Unknown URL";
$name = isset($_POST["name"]) ? $_POST["name"] : "Untitled Calendar";
$color = isset($_POST["color"]) ? $_POST["color"] : "FFFFFF";

$intID = intval($ID);
$URL = str_replace("webcal://", "https://", $URL);

$stmt = $db->prepare('UPDATE Calendars SET URL=?, Name=?, Color=? WHERE ID=?');
$stmt->bind_param('sssi', $URL, $name, $color, $intID);
$stmt->execute();
$stmt->close();

?>