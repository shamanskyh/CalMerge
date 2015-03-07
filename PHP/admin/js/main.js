// JavaScript Document

var addingCalendar = false;
var addingViewer = false;

// Attach the functions to the buttons
$(document).ready(function(){
	
	// Adding New Calendar
    $('#add-cal-button').click(function(){
		if (!addingCalendar) {
			addingCalendar = true;
			$('#calendars-panel-body').append('<div class="panel panel-default calendar-panel" id="new-cal-panel">\
					<div class="panel-heading clearfix">\
						<input id="new-cal-color" type="text" class="form-control input-sm pull-left" placeholder="1BADF8">\
						<input id="new-cal-name" type="text" class="form-control input-sm pull-left" placeholder="Name">\
						<button id="cancel-new-cal-button" type="button" class="btn btn-default btn-xs pull-right">\
							<span class="glyphicon glyphicon-remove"></span>\
						</button>\
					</div>\
					<div class="panel-body">\
						<span class="pull-left" style="display: block; margin-top: 5px; margin-right: 10px;"><b>URL:</b></span>\
						<input id="new-cal-address" type="url" class="form-control input-sm pull-left" style="margin-right: 10px;" placeholder="webcal://">\
						<button class="btn btn-sm btn-success pull-left" id="add-new-cal-button">Add</button>\
					</div>\
				</div>');
			
			// Scroll to the new box
			if (!($('#new-cal-panel').isOnScreen())) {
				$('html, body').animate({
        			scrollTop: $("#new-cal-panel").offset().top
    			}, 2000);
			}
			
			// Cancel Adding
			$('#cancel-new-cal-button').click(function() {
				$('#new-cal-panel').remove();
				addingCalendar = false;
			});
			
			// Finalize Adding
			$('#add-new-cal-button').click(function() {
				var color = $('#new-cal-color').val();
				var name = $('#new-cal-name').val();
				var address = $('#new-cal-address').val();
				
				// spin
				$('#add-new-cal-button').html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Adding...');
				
				var posting = $.post("addCal.php", { 'color': color, 'name': name, 'address': address });
				
				// grab the id when finished and make a new panel
				posting.done(function(data) {
					$('#calendars-panel-body').append('<div class="panel panel-default calendar-panel" id="calendar-' + data + '">\
						<div class="panel-heading clearfix">\
							<div class="calendar-color-swatch pull-left" style="background-color: #' + color + ';"></div>\
							<span class="calendar-title">' + name + '</span>\
							<button class="btn btn-danger btn-xs pull-right delete-cal-button" id="deletecal-' + data + '">\
								<span class="glyphicon glyphicon-trash"></span>\
							</button>\
							<button class="btn btn-default btn-xs pull-right edit-cal-button" id="editcal-' + data + '">\
								<span class="glyphicon glyphicon-edit"></span>\
							</button>\
						</div>\
						<div class="panel-body">\
							<b>URL:</b>\
							<span class="calendar-url">' + address + '</span>\
						</div>\
					</div>');
					
					$('#new-cal-panel').remove();
					addingCalendar = false;
					
					// add a new checkbox for each viewer
					$('.calendar-checkboxes').append('<label class="checkbox-inline cal-checkbox-' + data + '">\
					<input type="checkbox" value=""><span class="cal-checkbox-name-label">'
					+ name +
					'</span></label>');
					
					deleteCalClick();
					editCalClick();
					
					// unbind and rebind the checkboxes
					$('.calendar-checkboxes input').unbind();
					detectCheckboxChanges();
				});
			});
		}
    });
	
	// deleting a calendar
	function deleteCalClick() {
		$('.delete-cal-button').click(function() {
			
			var r = confirm("Are you sure you wish to delete this calendar?");
			if (r == true) {
    			var longID = $(this).attr('id');
				var prefix = "deletecal-";
				var ID = longID.substr(prefix.length);
		
				// spin
				$(this).html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>');
				
				var posting = $.post("removeCal.php", { 'id': ID });
		
				posting.done(function(data) {
					$('#calendar-' + ID).remove();
				
					// remove the checkbox from all the viewers
					$('.cal-checkbox-' + ID).remove();
				});
			}
		});
	}
	deleteCalClick();
	
	// editing a calendar (initial)
	function editCalClick() {
		$('.edit-cal-button').click(function() {
			var longID = $(this).attr('id');
			var prefix = "editcal-";
			var ID = longID.substr(prefix.length);
			
			var color = rgb2hex($(this).siblings("div.calendar-color-swatch").css("background-color")).substr(1, 6);
			var name = $(this).siblings("span.calendar-title").text();
			var URL = $(this).parent().parent().children(".panel-body").children(".calendar-url").text();
			
			var prevHTML = $(this).parent().parent().html();
			
			$('#calendar-' + ID).html('\
					<div class="panel-heading clearfix">\
						<input style="width: 70px;margin-right: 10px;" id="edit-cal-color-' + ID + '" type="text" class="form-control input-sm pull-left" value="'+ color +'">\
						<input style="width: 200px;" id="edit-cal-name-' + ID + '" type="text" class="form-control input-sm pull-left" value="' + name + '">\
						<button id="cancel-edit-cal-button-' + ID + '" type="button" class="btn btn-default btn-xs pull-right">\
							<span class="glyphicon glyphicon-remove"></span>\
						</button>\
					</div>\
					<div class="panel-body">\
						<span class="pull-left" style="display: block; margin-top: 5px; margin-right: 10px;"><b>URL:</b></span>\
						<input style="width: 75%;margin-right: 10px;" id="edit-cal-address-' + ID + '" type="url" class="form-control input-sm pull-left" style="margin-right: 10px;" value="' + URL + '">\
						<button class="btn btn-sm btn-success pull-left" id="update-edit-cal-button-' + ID + '">Update</button>\
					</div>')
					
			// Cancel Editing
			$('#cancel-edit-cal-button-' + ID).click(function() {
				$(this).parent().parent().html(prevHTML);
				$('.edit-cal-button').unbind();
				$('.delete-cal-button').unbind();
				editCalClick();
				deleteCalClick();
			});
			
			// Save Edits
			$('#update-edit-cal-button-' + ID).click(function() {
				// spin
				$('#update-edit-cal-button-' + ID).html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Saving...');
				var newName = $('#edit-cal-name-' + ID).val();
				var newColor = $('#edit-cal-color-' + ID).val();
				var newURL = $('#edit-cal-address-' + ID).val();
				var posting = $.post("editCal.php", { 'ID': ID, 'name': newName, 'color': newColor, 'URL': newURL });
				
				var box = $(this).parent().parent();
				
				posting.done(function(data) {
					
					// change back to unediting
					box.html('<div class="panel-heading clearfix">\
							<div class="calendar-color-swatch pull-left" style="background-color: #' + newColor + ';"></div>\
							<span class="calendar-title">' + newName + '</span>\
							<button class="btn btn-danger btn-xs pull-right delete-cal-button" id="deletecal-' + ID + '">\
								<span class="glyphicon glyphicon-trash"></span>\
							</button>\
							<button class="btn btn-default btn-xs pull-right edit-cal-button" id="editcal-' + ID + '">\
								<span class="glyphicon glyphicon-edit"></span>\
							</button>\
						</div>\
						<div class="panel-body">\
							<b>URL:</b>\
							<span class="calendar-url">' + newURL + '</span>\
						</div>');
						
					// change name in all the checkboxes
					$('label.cal-checkbox-' + ID).children('span.cal-checkbox-name-label').text(newName);
					
					// unbind and rebind
					$('.edit-cal-button').unbind();
					$('.delete-cal-button').unbind();
					editCalClick();
					deleteCalClick();
					
				});
			});
			
		});
	}
	editCalClick();
		
	// Adding new viewer
    $('#add-viewer-button').click(function(){
		if (!addingViewer) {
			addingViewer = true;
			$('#viewers-panel-body').append('<div class="panel panel-default viewer-panel" id="new-viewer-panel">\
				<div class="panel-heading clearfix">\
					<input id="new-viewer-name" type="text" class="form-control input-sm pull-left" placeholder="Name">\
					<button class="btn btn-sm btn-success pull-left" id="add-new-viewer-button">Add</button>\
					<button class="btn btn-xs btn-default pull-right" id="cancel-new-viewer-button">\
						<span class="glyphicon glyphicon-remove"></span>\
					</button>\
				</div>\
			</div>');
			
			// Scroll to the new box
			if (!($('#new-viewer-panel').isOnScreen())) {
				$('html, body').animate({
        			scrollTop: $("#new-viewer-panel").offset().top
    			}, 2000);
			}
			
			// Cancel Adding
			$('#cancel-new-viewer-button').click(function() {
				$('#new-viewer-panel').remove();
				addingViewer = false;
			});
			
			// Finalize Adding
			$('#add-new-viewer-button').click(function() {
				var name = $('#new-viewer-name').val();
				
				// spin
				$('#add-new-viewer-button').html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Adding...');
				
				var posting = $.post("addViewer.php", { 'name': name });
				
				// grab the id when finished and make a new panel
				posting.done(function(data) {
					var response = jQuery.parseJSON(data);
					var ID = response.id;
					var token = response.key;
					var calendars = response.calendars;
					var sharePrefix = response.sharePrefix;
					
					// remove the adding panel
					$('#new-viewer-panel').remove();
					addingViewer = false;
					
					// make a new panel
					$('#viewers-panel-body').append('<div class="panel panel-default viewer-panel" id="viewer-' + ID + '">\
								<div class="panel-heading clearfix">\
									<span class="viewer-name">' + name + '</span>\
									<button class="btn btn-danger btn-xs pull-right delete-viewer-button" id="deleteviewer-' + ID + '">\
										<span class="glyphicon glyphicon-trash"></span>\
									</button>\
									<button class="btn btn-default btn-xs pull-right edit-viewer-button" id="editviewer-' + ID + '">\
										<span class="glyphicon glyphicon-edit"></span>\
									</button>\
								</div>\
								<div class="panel-body">\
								<b>Share URL:</b>\
								<input style="width:85%;display:inline;" id="share-url-' + ID + '" type="url" class="form-control input-sm share-url" value="' + sharePrefix + token + '" readonly>\
								<div class="calendar-checkboxes">\
								</div>\
							</div>\
						</div>')
						
					// add the checkboxes to the new panel
					calendars.forEach(function(cal) {
						$('div#viewer-' + ID + ' .panel-body .calendar-checkboxes').append('\
						<label class="checkbox-inline cal-checkbox-' + cal["id"] + '">\
							<input type="checkbox">\
							<span class="cal-checkbox-name-label">' + cal["name"] + '</span>\
						</label>');
					});
					
					
					// unbind and rebind
					$('.edit-viewer-button').unbind();
					$('.delete-viewer-button').unbind();
					$('.share-url').unbind();
					$('.calendar-checkboxes input').unbind();
					editViewerName();
					deleteViewerClick();
					highlightShareURL();
					detectCheckboxChanges();
					
				});	//end post return
			}); // end add button click
		}
	}); // end full adding viewer
	
	function editViewerName() {
		$('.edit-viewer-button').click(function() {
			var longID = $(this).attr('id');
			var prefix = "editviewer-";
			var ID = longID.substr(prefix.length);
			
			var prevName = $(this).siblings('.viewer-name').text();
			var prevHTML = $(this).parent().html();
			
			var header = $(this).parent();
			
			header.html('<input style="margin-right:10px;width: 30%;" type="text" value="' + prevName + '" class="form-control input-sm pull-left" id="edit-viewer-name-' + ID + '">\
			<button class="btn btn-sm btn-success pull-left" id="update-edit-viewer-name-button-' + ID + '">Update</button>\
			<button id="cancel-edit-viewer-name-button-' + ID + '" type="button" class="btn btn-default btn-xs pull-right">\
				<span class="glyphicon glyphicon-remove"></span>\
			</button>');
			
			// Cancel Editing
			$('#cancel-edit-viewer-name-button-' + ID).click(function() {
				$(this).parent().html(prevHTML);
				$('.edit-viewer-button').unbind();
				$('.delete-viewer-button').unbind();
				editViewerName();
				deleteViewerClick();
			});
			
			// Save Edits
			$('#update-edit-viewer-name-button-' + ID).click(function() {
				// spin
				$('#update-edit-viewer-name-button-' + ID).html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Saving...');
				var newName = $('#edit-viewer-name-' + ID).val();
				
				var posting = $.post("editViewerName.php", { 'ID': ID, 'name': newName });
				
				posting.done(function(data) {
					header.html('<span class="viewer-name">' + newName + '</span>\
					<button class="btn btn-danger btn-xs pull-right delete-viewer-button" id="deleteviewer-' + ID + '">\
						<span class="glyphicon glyphicon-trash"></span>\
					</button>\
					<button class="btn btn-default btn-xs pull-right edit-viewer-button" id="editviewer-' + ID + '">\
						<span class="glyphicon glyphicon-edit"></span>\
					</button>');
					
					// unbind and rebind
					$('.edit-viewer-button').unbind();
					$('.delete-viewer-button').unbind();
					$('.share-url').unbind();
					editViewerName();
					deleteViewerClick();
					highlightShareURL();
				});
				
			});
			
		});
		
		
	}
	editViewerName();
	
	function deleteViewerClick() {
		$('.delete-viewer-button').click(function() {
			var r = confirm("Are you sure you wish to delete this viewer? This cannot be undone.");
			if (r == true) {
    				var longID = $(this).attr('id');
				var prefix = "deleteviewer-";
				var ID = longID.substr(prefix.length);
		
				// spin
				$(this).html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>');
				
				var posting = $.post("removeViewer.php", { 'id': ID });
		
				posting.done(function(data) {
					$('#viewer-' + ID).remove();
				});
			}
		});
	}
	deleteViewerClick();
	
	function highlightShareURL() {
		$('.share-url').click(function() {
			$(this).select();
		});
	}
	highlightShareURL();
	
	// detect checkbox changes
	function detectCheckboxChanges() {
		$('.calendar-checkboxes input').bind('change', function() {
			var longCalIDs = $(this).parent('label').attr('class').split(" ");
			var longCalID = longCalIDs[longCalIDs.length - 1];
			var calPrefix = "cal-checkbox-";
			var calID = longCalID.substr(calPrefix.length);
			
			var longViewerID = $(this).parents('.viewer-panel').attr('id');
			var viewerPrefix = "viewer-";
			var viewerID = longViewerID.substr(viewerPrefix.length);
			
			var add = this.checked
			
			$.post("linkCalViewer.php", { 'add': add, 'calID': calID, 'viewerID': viewerID });
		});
	}
	detectCheckboxChanges();
	
});

// function to test if something is on screen
$.fn.isOnScreen = function(){
    var element = this.get(0);
    var bounds = element.getBoundingClientRect();
    return bounds.top < window.innerHeight && bounds.bottom > 0;
}

// convert RBG values to hex
function rgb2hex(rgb) {
     if (  rgb.search("rgb") == -1 ) {
          return rgb;
     } else {
          rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
          function hex(x) {
               return ("0" + parseInt(x).toString(16)).slice(-2);
          }
          return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
     }
}