<?php

include_once("../config.php");

$ID = $_POST["id"];

$stmt = $db->prepare('DELETE FROM Calendars WHERE ID=?');
$stmt->bind_param('i', $ID);
$stmt->execute();
$stmt->close();

?>