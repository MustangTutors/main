$(document).ready(function(){
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
			$('#share_alert').show();
		}
	});

	$(document).on('click')
});