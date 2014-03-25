$(document).ready(function() {
    $("header").load("header.html", setToggleColor);
    $("footer").load("footer.html");

    setNavigationBar();

    // Change font color on toggle switch
    $(document).on('change', 'label.toggle input[type="checkbox"]', setToggleColor);

    // Toggle availability
    $(document).on('change', '#toggleButton input[type="checkbox"]', toggleAvailability);

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
            $('#welcomeMessage #welcome img[src="img/gear_arrow_light.png"]').css('-webkit-transform', 'rotate(-90deg');
            $('#settings').focus();
        }
    });

    // If you click away from the settings, the dropdown hides.
    $(document).on('blur', '#settings', function() {
        $('#welcomeMessage #welcome .dropdown').slideUp();
        $('#welcomeMessage #welcome img[src="img/gear_arrow_light.png"]').css('-webkit-transform', 'rotate(0deg');
        $('#welcomeMessage #welcome img[src="img/gear_arrow.png"]').css('-webkit-transform', 'rotate(0deg');
    });

    // Add "Settings" message when user hovers over settings icon and change settings icon
    $(document).on('mouseover', '#settings', function(){
        // Make "Settings" message appear
        if($('#welcomeMessage #welcome .dropdown').css('display') !== "block"){
            $('#settings_message').css('display', 'inline-block');
        }
        $('#settings .welcome').css('color', '#E2E0D7');
        $('#settings img[src="img/gear.png"]').attr('src', 'img/gear_light.png');
        $('#settings img[src="img/gear_arrow.png"]').attr('src', 'img/gear_arrow_light.png');
    });

    // Remove "settings" message and change settings icon back
    $(document).on('mouseout', '#settings', function(){
        // Make "Settings" message disappear
        $('#settings_message').hide();
        $('#settings .welcome').css('color', '#D7D4C8');
        $('#settings img[src="img/gear_light.png"]').attr('src', 'img/gear.png');
        $('#settings img[src="img/gear_arrow_light.png"]').attr('src', 'img/gear_arrow.png');
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

// Toggle availability
function toggleAvailability() {
    // Call toggle
    $.ajax({
        type: "GET",
        url: "Laravel/public/users/toggle",
        success: function(json) {}
    });
}

// Convert from military time to standard time
function convertTime(militaryTime) {
    var hours24 = parseInt(militaryTime.substring(0, 2),10);
    var hours = ((hours24 + 11) % 12) + 1;
    var amPm = hours24 > 11 ? 'PM' : 'AM';
    var minutes = militaryTime.substring(3);

    return hours + ':' + minutes + amPm;
}

function setNavigationBar() {
    // Parse JSON for user info
    $.ajax({
        url: "json/user_info.json",
        success: function(json) {
            //json = JSON.parse(json);

            // Logged in
            if(json.length !== 0) {
                // If the user is not a tutor
                if(json.tutor === 0 || json.active === 0) {
                    // Hide the toggle availability
                    $("nav li#toggleButton").hide();

                    // Add navigation for student user
                    var newNav = '<li class="nav"><a href="#">Become a Tutor</a></li>'+
                                '<li class="nav"><a href="history.html">Student History</a>'+
                                '<ul class="dropdown"><div class="border">'+
                                '<li><a href="history.html">Your History</a></li>'+
                                '<li><a href="findstudent.html">Search for Student</a></li></div></ul></li>'+
                                '<li class="nav"><a href="index.html">Search for Tutors</a></li>';
                    $('nav #navigation').append(newNav);

                    // If admin, add navigation options for admin
                    if(json.admin === 1){
                        newNav = '<li class="nav"><a href="applications.html">Applications<span id="counter">2</span></a></li>';
                        $('nav #navigation').append(newNav);
                    }
                }
                else {
                    // Call toggle
                    $.ajax({
                        type: "GET",
                        url: "Laravel/public/users/available" + json.user_id,
                        success: function(json) {
                            if(json.available === 1) {
                                // Set toggle to "Busy"
                                $('#navigation label.toggle input[type="checkbox"]').prop('checked', true);
                                // If the toggle is 'checked' (slider is on the right)
                                
                                // Set the colors
                                $('#navigation label.toggle span.false').css('color', '#AAA');
                                $('#navigation label.toggle span.true').css('color', 'white');
                            }
                            else {
                                // Set toggle to "Available"
                                $('#navigation label.toggle input[type="checkbox"]').prop('checked', false);

                                // Set the colors
                                $('#navigation label.toggle span.false').css('color', 'white');
                                $('#navigation label.toggle span.true').css('color', '#AAA');
                            }
                        }
                    });

                    // Add navigation for tutor user
                    var newNav = '<li class="nav"><a href="history.html">Student History</a>'+
                                '<ul class="dropdown"><div class="border">'+
                                '<li><a href="history.html">Your History</a></li>'+
                                '<li><a href="findstudent.html">Search for Student</a></li></div></ul></li>'+
                                '<li class="nav"><a href="index.html">Search for Tutors</a></li>';
                    $('nav #navigation').append(newNav);

                    // If admin, add navigation options for admin
                    if(json.admin === 1){
                        newNav = '<li class="nav"><a href="applications.html">Applications<span id="counter">2</span></a></li>';
                        $('nav #navigation').append(newNav);
                    }
                }
            }
            // Not logged in
            else {
                var reg = '<li class="nav"><a href="register.html">Register</a></li>'+
                        '<li class="nav"><a href="findstudent.html">Search for Student</a></li>';
                $('nav #navigation').append(reg);
            }
        }
    });
}