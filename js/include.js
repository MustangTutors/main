$(document).ready(function() {
    $("header").load("header.html");
    $("footer").load("footer.html");

    changeToggleColor();

    // Change font color on toggle switch
    $(document).on('change', 'label.toggle input[type="checkbox"]', changeToggleColor);
});

function changeToggleColor() {
	if($(this)[0] !== undefined){
		var which = $(this).prop('checked');

		if(which){
			$(this).siblings('span').children('span.false').css('color', '#AAA');
			$(this).siblings('span').children('span.true').css('color', 'white');
		}
		else {
			$(this).siblings('span').children('span.false').css('color', 'white');
			$(this).siblings('span').children('span.true').css('color', '#AAA');
		}
	}
	else {
		$('label.toggle input[type="checkbox"]').siblings('span').children('span.false').css('color', '#AAA');
		$('label.toggle input[type="checkbox"]').siblings('span').children('span.true').css('color', 'white');
	}	
}