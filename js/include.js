$(document).ready(function() {
    $("header").load("header.html", setToggleColor);
    $("footer").load("footer.html");

    // Change font color on toggle switch
    $(document).on('change', 'label.toggle input[type="checkbox"]', setToggleColor);

    // If settings icon is clicked, show dropdown
    $(document).on('click', '#welcomeMessage #welcome', function() {
        $('#settings_message').hide();

        var drop = $('#welcomeMessage #welcome .dropdown');

        if(drop.css('display') === "block"){
            $('#settings').blur();
            $('#settings_message').css('display', 'inline-block');
        }
        else {
            drop.slideDown();
            $('#welcomeMessage #welcome img[src="img/gear_arrow.png"]').css('-webkit-transform', 'rotate(-90deg');
            $('#settings').focus();
        }
    });

    // If you click away from the settings, the dropdown hides.
    $(document).on('blur', '#settings', function() {
        $('#welcomeMessage #welcome .dropdown').slideUp();
        $('#welcomeMessage #welcome img[src="img/gear_arrow.png"]').css('-webkit-transform', 'rotate(0deg');
    });

    // Add "Settings" message when user hovers over settings icon and change settings icon
    $(document).on('mouseover', '#settings', function(){
        // Make "Settings" message appear
        if($('#welcomeMessage #welcome .dropdown').css('display') !== "block"){
            $('#settings_message').css('display', 'inline-block');
        }
        $('#settings .welcome').css('color', '#E2E0D7');
    });

    // Remove "settings" message and change settings icon back
    $(document).on('mouseout', '#settings', function(){
        // Make "Settings" message disappear
        $('#settings_message').hide();
        $('#settings .welcome').css('color', '#D7D4C8');
    });
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

// Convert from military time to standard time
function convertTime(militaryTime) {
    var hours24 = parseInt(militaryTime.substring(0, 2),10);
    var hours = ((hours24 + 11) % 12) + 1;
    var amPm = hours24 > 11 ? 'PM' : 'AM';
    var minutes = militaryTime.substring(3);

    return hours + ':' + minutes + amPm;
}