<?php

include_once("../config.php");

$calID = isset($_POST["calID"]) ? $_POST["calID"] : -1;
$viewerID = isset($_POST["viewerID"]) ? $_POST["viewerID"] : -1;
$add = isset($_POST["add"]) ? $_POST["add"] : "true";

if ($add == 'true') {
	$stmt = $db->prepare('INSERT INTO CalendarViewers (CalendarID, ViewerID) VALUES (?, ?)');
} else {
	$stmt = $db->prepare('DELETE FROM CalendarViewers WHERE CalendarID=? AND ViewerID=?');
}
$stmt->bind_param('ii', $calID, $viewerID);
$stmt->execute();
$stmt->close();

?>