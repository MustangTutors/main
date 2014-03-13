$(document).ready(function() {
    $("header").load("header.html", setToggleColor);
    $("footer").load("footer.html");

    // Change font color on toggle switch
    $(document).on('change', 'label.toggle input[type="checkbox"]', setToggleColor);

    // If settings icon is clicked, show dropdown
    $(document).on('click', '#welcomeMessage #welcome', function() {
        var drop = $('#welcomeMessage #welcome .dropdown');

        if(drop.css('display') === "block"){
            drop.hide();
            $('#welcomeMessage #welcome img[src="img/gear_arrow.png"]').animate({  borderSpacing: 0 }, {
                step: function(now,fx) {
                  $(this).css('-webkit-transform','rotate('+now+'deg)'); 
                },
                duration:'fast'
            });
        }
        else {
            drop.show();
            $('#welcomeMessage #welcome img[src="img/gear_arrow.png"]').animate({  borderSpacing: -90 }, {
                step: function(now,fx) {
                  $(this).css('-webkit-transform','rotate('+now+'deg)'); 
                },
                duration:'fast'
            });
        }
    });

    // Add "Settings" message when user hovers over settings icon and change settings icon
    $(document).on('mouseover', '#settings', function(){
        // Make "Settings" message appear
        $('#settings_message').css('display', 'inline-block');

        // Change settings icon to gray
        $('#settings').attr('src', 'img/gear.png');
    });

    // Remove "settings" message and change settings icon back
    $(document).on('mouseout', '#settings', function(){
        // Make "Settings" message disappear
        $('#settings_message').hide();

        // Change settings icon to black
        $('#settings').attr('src', 'img/gear.png');
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