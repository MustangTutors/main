$(document).ready(function(){
	// Add "Share" message when user hovers over share icon and change share icon to gray
	$(document).on('mouseover', '#share', function(){
		// Make "Share" message appear
		$('#share_message').css('display', 'inline-block');
	});
});