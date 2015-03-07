<?php

include_once("config.php");

$token = isset($_GET["token"]) ? $_GET["token"] : "ERROR";
$viewerID = NULL;

// capture the userID from the token, die if there's no ID
$stmt = $db->prepare('SELECT ID FROM Viewers WHERE Token=?');
$stmt->bind_param('s', $token);
$stmt->execute();
$stmt->bind_result($tempID);
while ($stmt->fetch()) {
	$viewerID = $tempID;
}
$stmt->close();

// die if we couldn't find the token
if ($viewerID == NULL) {
	header("HTTP/1.1 401 Unauthorized");
	exit;
}

$stmt = $db->prepare('SELECT Calendars.URL FROM CalendarViewers INNER JOIN Calendars ON CalendarViewers.CalendarID=Calendars.ID WHERE CalendarViewers.ViewerID=?');
$stmt->bind_param('i', $viewerID);
$stmt->execute();
$stmt->bind_result($URL);
$calendars = array();
while ($stmt->fetch()){
	array_push($calendars, $URL);
}
$stmt->close();


// boilerplate cal code that begins the calendar and specifies its name and color
$calOutput = "BEGIN:VCALENDAR\nVERSION:2.0\nX-WR-CALNAME:".$calOutputName."\nX-APPLE-CALENDAR-COLOR:".$calOutputColor."FF\n";

// add the time zone info
// NOTE: timezones.txt needs to be updated manually if calendars use multiple timezones
// TODO: Scan calendars for timezone info and create an aggregate
$calOutput = $calOutput . file_get_contents("timezones.txt") . "\n";

// get the data from each URL here and merge them together
foreach ($calendars as $i=>$calURL) {
 
	$calText = geturl($calURL, true);
	$begin = strpos($calText, "BEGIN:VEVENT");
	$end = strpos($calText, "END:VCALENDAR");
	$calOutput = $calOutput . substr($calText, $begin, $end - $begin);

}

$calOutput = $calOutput . "END:VCALENDAR";

//set correct content-type-header
header('Content-type: text/calendar; charset=utf-8');
header('Content-Disposition: inline; filename='.$calOutputName.'.ics');
	
echo($calOutput);


function geturl($url, $headers){

	(function_exists('curl_init')) ? '' : die('cURL Must be installed for geturl function to work. Ask your host to enable it or uncomment extension=php_curl.dll in php.ini');

    $cookie = tempnam ("/tmp", "CURLCOOKIE");
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; CrawlBot/1.0.0)');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie);
    curl_setopt($ch, CURLOPT_HEADER, $headers);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT , 5);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    //curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_ENCODING, "");
    curl_setopt($ch, CURLOPT_AUTOREFERER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);    # required for https urls
    curl_setopt($ch, CURLOPT_MAXREDIRS, 15);     

	$html = curl_exec($ch);
	$status = curl_getinfo($ch);
	curl_close($ch);
	
	if($status['http_code']!=200){
		if($status['http_code'] == 301 || $status['http_code'] == 302) {
			list($header) = explode("\r\n\r\n", $html, 2);
			$matches = array();
			preg_match("/(Location:|URI:)[^(\n)]*/", $header, $matches);
			$url = trim(str_replace($matches[1],"",$matches[0]));
			$url_parsed = parse_url($url);
			
			return (isset($url_parsed))? geturl($url, false):'';
		}
	}
	return $html;
}


?>