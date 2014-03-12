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

	// Hide share window when cancel is clicked
	$(document).on('click', '#share_cancel', function(){
		// Hide share window
		$('#share_window').hide();
	});

	// Add new email box when the last email box is clicked
	$(document).on('click', '#share_window .share_email input[type="email"]:last-of-type', function(){
		var new_email = $('<div class="share_email"><label for="email">Email:</label><input type="email" name="email" placeholder="Enter an email" required></div>');
        new_email.insertBefore('#share_window div.center');
	});
});