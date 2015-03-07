<?php
session_start();
include_once("../config.php");
include_once("calendar.php");
include_once("viewer.php");
?>


<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CalMerge</title>
    
    <!-- Bootstrap -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/main.css">
  </head>
  <body>
    <h1>CalMerge</h1>
	<br>
    <div class="container">
		<div class="panel panel-default">
        	<div class="panel-heading clearfix"><h2 class="panel-title pull-left">Calendars</h2>
            	<button id="add-cal-button" type="button" class="btn btn-default btn-xs add-button pull-right">
                	<span class="glyphicon glyphicon-plus"></span>
                </button></div>
			<div id="calendars-panel-body" class="panel-body">
                <?
					$calendars = array();
					$stmt = $db->prepare('SELECT ID, URL, Name, Color FROM Calendars');
					$stmt->execute();
					$stmt->bind_result($ID, $URL, $name, $color);
					while ($stmt->fetch()){
						$cal = new Calendar;
						$cal->id = $ID;
						$cal->URL = $URL;
						$cal->name = $name;
						$cal->color = $color;
						array_push($calendars, $cal);
					}
					$stmt->close();
					
					foreach($calendars as $calendar) {
						echo("<div class='panel panel-default calendar-panel' id='calendar-".$calendar->id."'>
								<div class='panel-heading clearfix'>
									<div class='calendar-color-swatch pull-left' style='background-color: #".$calendar->color.";'></div>
									<span class='calendar-title'>".$calendar->name."</span>
									<button class='btn btn-danger btn-xs pull-right delete-cal-button' id='deletecal-".$calendar->id."'>
										<span class='glyphicon glyphicon-trash'></span>
									</button>
									<button class='btn btn-default btn-xs pull-right edit-cal-button' id='editcal-".$calendar->id."'>
										<span class='glyphicon glyphicon-edit'></span>
									</button>
								</div>
								<div class='panel-body'>
								<b>URL:</b>
								<span class='calendar-url'>".$calendar->URL."</span>
								</div>
							  </div>
						");
					}
				?>
			</div>
        </div>
        
        <div class="panel panel-default">
        	<div class="panel-heading clearfix"><h2 class="panel-title pull-left">Viewers</h2><button id="add-viewer-button" type="button" class="btn btn-default btn-xs add-button pull-right"><span class="glyphicon glyphicon-plus"></span></button></div>
			<div id="viewers-panel-body" class="panel-body">
    			<?
					$viewers = array();
					$stmt = $db->prepare('SELECT ID, Name, Token FROM Viewers');
					$stmt->execute();
					$stmt->bind_result($ID, $name, $token);
					while ($stmt->fetch()){
						$viewer = new Viewer;
						$viewer->id = $ID;
						$viewer->name = $name;
						$viewer->token = $token;
						array_push($viewers, $viewer);
					}
					$stmt->close();
					
					foreach($viewers as $viewer) {
						
						$calIDs = array();
						$stmt = $db->prepare('SELECT CalendarID FROM CalendarViewers WHERE ViewerID=?');
						$stmt->bind_param('i', $viewer->id);
						$stmt->execute();
						$stmt->bind_result($calID);
						while ($stmt->fetch()){
							array_push($calIDs, $calID);
						}
						$stmt->close();
						
						echo("<div class='panel panel-default viewer-panel' id='viewer-".$viewer->id."'>
								<div class='panel-heading clearfix'>
									<span class='viewer-name'>".$viewer->name."</span>
									<button class='btn btn-danger btn-xs pull-right delete-viewer-button' id='deleteviewer-".$viewer->id."'>
										<span class='glyphicon glyphicon-trash'></span>
									</button>
									<button class='btn btn-default btn-xs pull-right edit-viewer-button' id='editviewer-".$viewer->id."'>
										<span class='glyphicon glyphicon-edit'></span>
									</button>
								</div>
								<div class='panel-body'>
								<b>Share URL:</b>
								<input style='width:85%;display:inline;' id='share-url-".$viewer->id."' type='url' class='form-control input-sm share-url' value='".$sharePrefix.$viewer->token."' readonly>
								<div class='calendar-checkboxes'>");
								
								foreach($calendars as $calLine) {
									echo("<label class='checkbox-inline cal-checkbox-".$calLine->id."'>");
									echo("<input type='checkbox'");
									if (in_array($calLine->id, $calIDs)) {
										echo(" checked>");
									} else {
										echo(">");
									}
									echo("<span class='cal-checkbox-name-label'>".$calLine->name."</span>");
									echo("</label>");
								}
								
						echo("
								</div>
								</div>
								</div>
						");
					}
				?>
			</div>
        </div>
    </div>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
    <!-- Custom scripting that interacts with database using Ajax -->
    <script src="js/main.js"></script>
  </body>
</html>