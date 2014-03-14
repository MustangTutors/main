$(document).ready(function(){
	if(true){
		toggleView();
	}

	// When toggle view clicked, load correct view
	$(document).on('change', '#history_view input[type="checkbox"]', toggleView);

	// Add "Share" message when user hovers over share icon and change share icon to gray
	$(document).on('mouseover', '#share', function(){
		// Make "Share" message appear
		$('#share_message').css('display', 'inline-block');

		// Change share icon to gray
		$('#share').attr('src', 'img/share_gray.png');
	});

	// Remove "share" message and change share icon back to black
	$(document).on('mouseout', '#share', function(){
		// Make "Share" message disappear
		$('#share_message').hide();

		// Change share icon to black
		$('#share').attr('src', 'img/share.png');
	});

	// Show share window when the share icon is clicked
	$(document).on('click', '#share', function(){
		// Show share window
		$('#share_window').show();
	});

	// When cancel is clicked on share window
	$(document).on('click', '#share_cancel', function(){
		// Hide share window
		$('#share_window').hide();

		// Hide show alert
		$('#share_alert').hide();

		// Clear all email boxes
		$('#share_window #share_form .share_email_holder div.share_email').remove();

		// Create new one
		var new_email = $('<div class="share_email"><label for="email">Email:</label><input type="email" name="email" placeholder="Enter an email"></div>');
        $('#share_window #share_form .share_email_holder').append(new_email);
	});

	// Add new email box if clicked or tabbed into
	$(document).on('focus', '#share_window #share_form .share_email_holder div.share_email:last-of-type input[type="email"]', function(){
		if($('#share_window #share_form .share_email_holder div.share_email input[type="email"]').length < 12) {
			var new_email = $('<div class="share_email"><label for="email">Email:</label><input type="email" name="email" placeholder="Enter an email"></div>');
       		$('#share_window #share_form .share_email_holder').append(new_email);
		}
		else {
			$('#share_alert').css('display', 'block');
		}
	});

	// Add "Add" message when user hovers over add icon and "Cancel" when over subtract icon
	$(document).on('mouseover', '.add_meeting .add', function(){
		if($('.add_meeting .subtract.add').css('display') === "none"){
			// Make "Add" message appear
			$('#add_message').css('display', 'inline-block');
		}
		else {
			// Make "Cancel" message appear
			$('#cancel_message').css('display', 'inline-block');
		}
	});

	// Remove "add" message and "Cancel" when over subtract icon
	$(document).on('mouseout', '.add_meeting .add', function(){
        // Make "Cancel" message disappear
        $('#cancel_message').hide();
        // Make "Add" message disappear
        $('#add_message').hide();
	});

	// Change add icon to subtract icon on click
	$(document).on('click', '.add_meeting .add', function(){
		if($('.add_meeting .subtract.add').css('display') === "none"){
			$('#add_icon').hide();
			$('#subtract_icon').css('display', 'inline-block');
			showAddMeetingWindow();
		}
		else {
			$('#subtract_icon').hide();
			$('#add_icon').css('display', 'inline-block');
			hideAddMeetingWindow();
		}
	});
});

// Toggle view of history
function toggleView() {
	var view = $('#history_view input[type="checkbox"]').prop('checked');

	// If on Student View
	if(view) {
		$('#tutor_history').fadeOut(100, function() {
			$('#student_history').fadeIn(100);
		});	
	}
	// Else on Tutor View
	else {
		$('#student_history').fadeOut(100, function() {
			$('#tutor_history').fadeIn(100);
		});	
	}
}

function showAddMeetingWindow(){
	$('#tutor_history #meeting_form').slideDown();
	$('#tutor_history article.add_meeting').animate({height: "350px"}, 400);
	
}

function hideAddMeetingWindow(){
	$('#tutor_history #meeting_form').slideUp();
	$('#tutor_history article.add_meeting').animate({height: "40px"}, 400);
}