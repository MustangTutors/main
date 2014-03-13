$(document).ready(function() {
    $("header").load("header.html", setToggleColor);
    $("footer").load("footer.html");

    // Change font color on toggle switch
    $(document).on('change', 'label.toggle input[type="checkbox"]', setToggleColor);
});

// Set the color of the toggle
function setToggleColor() {
    var which = $(this).prop('checked');

    // If the toggle is 'checked' (slider is on the right)
    if(which){
        // Set the colors
        $(this).siblings('span').children('span.false').css('color', '#AAA');
        $(this).siblings('span').children('span.true').css('color', 'white');
    }
    // If the toggle is 'unchecked' (slider is on the left)
    else {
        // If a toggle was clicked, use 'this', otherwise target all the toggles.
        var toggle;
        if (which === undefined) {
            toggle = $('label.toggle input[type="checkbox"]');
        }
        else {
            toggle = $(this);
        }
        // Set the colors
        toggle.siblings('span').children('span.false').css('color', 'white');
        toggle.siblings('span').children('span.true').css('color', '#AAA');
    }
}