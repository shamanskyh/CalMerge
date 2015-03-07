<?php

include_once("../config.php");

$ID = isset($_POST["ID"]) ? $_POST["ID"] : "-1";
$name = isset($_POST["name"]) ? $_POST["name"] : "Unknown Viewer";

$intID = intval($ID);

$stmt = $db->prepare('UPDATE Viewers SET Name=? WHERE ID=?');
$stmt->bind_param('si', $name, $intID);
$stmt->execute();
$stmt->close();

?>