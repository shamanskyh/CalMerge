<?php

$db = new mysqli('localhost', 'USERNAME', 'PASSWORD', 'DATABASE_NAME');
if ($db->connect_error) {
    die('Connect Error (' . $mysqli->connect_errno . ') '
            . $mysqli->connect_error);
}
$db->set_charset("utf8");

// Global Share URL Prefix
$sharePrefix = "webcal://YOUR URL HERE";

$calOutputName = "Merged Calendar";
$calOutputColor = "#FF9500";

?>