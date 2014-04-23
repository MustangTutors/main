// Check if the user is logged in. If not, redirect to findstudent.html
$.ajax({
    url: "Laravel/public/users/current",
    success: function(json) {
        json = JSON.parse(json);
        if (json.length === 0) {
            window.location.href = "findstudent.html";
        }
    }
});

$(document).ready(function(){
    showView();
    fillNewMeetingCourses();

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
		$('#share_window').fadeIn(200);
	});

	// When cancel is clicked on share window
	$(document).on('click', '#share_cancel', closeAndClearShare);

    // When send is clicked on share window
    $(document).on('submit', '#share_form', function(){
        event.preventDefault();
        var values = false;

        for(var i = 0; i < $('.share_email input[type="email"]').length; i++){
            if($('.share_email input[type="email"]').eq(i).val() !== ""){
                values = true;
            }
        }

        if(values) {
            // Sned JSON with all emails
            sendEmailJSON();

            // Close and clear share window
            closeAndClearShare();
        } else {
            alert("Please enter an email before continuing.");
        }
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
        populateDateAndTime();
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

    // When Add is clicked/new meeting form is submitted
    $(document).on('submit', '#meeting_form', function(){
        event.preventDefault();
        $("#meeting_form span.error").html("");

        // Create JSON for new meeting
        var new_meeting = new Object();
        new_meeting = createNewMeetingObject();
        var newMeetingJSON = JSON.stringify(new_meeting);

        

        // Send JSON to database
        $.ajax({
            type: "POST",
            url: "Laravel/public/tutors/addMeeting",
            data: {post_meeting : newMeetingJSON},
            success: function(json) {
                console.log(json);

                if(json !== "not a valid smu id"){

                    // Clear and close new meeting window
                    resetNewMeetingForm();
                    $('#subtract_icon').hide();
                    $('#add_icon').css('display', 'inline-block');
                    hideAddMeetingWindow();

                    json = JSON.parse(json);
                    new_meeting.first_name = json[0].fName;
                    new_meeting.last_name = json[0].lname;
                    addNewMeeting(new_meeting);
                }
                else {
                    $("article.add_meeting").height("360px");
                    $("#meeting_form span.error").html("You cannot add a meeting with yourself.");
                }
            }
        });
    });

    // When Reset is clicked on new meeting form
    $(document).on('click', '#reset_meeting', function(){
        event.preventDefault();

        resetNewMeetingForm();
    });

	// Parse JSON for student meetings
    $.ajax({
        url: "Laravel/public/users/history",
        success: function(json) {
            json = JSON.parse(json);

            if(json.meetings === undefined) {
                $('#student_history span.error.none').html("You have not yet attended any tutoring sessions.");
            }
            else {
                $('#student_history span.error.none').html("");
                json = json.meetings;
                for(var i = 0; i < json.length; i++) {
                    // Assign json values
                    var title = json[i].subject + " " + json[i].course_number + ": " + json[i].course_name;
                    var contributor = "Tutored by: " + json[i].fName + " " + json[i].lName;
                    var date = json[i].day;
                    var time = convertTime(json[i].start_time) + " to " + convertTime(json[i].end_time);
                    var summary = json[i].summary;

                    // Create and append new node with json information
                    var newArticle = $('<article class="meeting"><div class="course_contributor"><h3 class="subheading">' + title + '</h3>' +
                                        '<span class="contributor">' + contributor + '</span></div><div class="date_time"><span class="date">' + date + '</span>' +
                                        '<br><span class="time">' + time + '</span></div><span class="summary">' + summary + '</span></article>');
                    $('#student_history').append(newArticle);
                }
            }
        }
    });

    // Parse JSON for tutor meetings
    $.ajax({
        url: "Laravel/public/tutors/history",
        success: function(json) {
            json = JSON.parse(json);

            if(json.meetings === undefined){
                $('#tutor_history span.error.none').html("You have not yet tutored any students yet.");
            }
            else {
                $('#tutor_history span.error.none').html("");
                json = json.meetings;
                for(var i = 0; i < json.length; i++) {
                    // Assign json values
                    var title = json[i].subject + " " + json[i].course_number + ": " + json[i].course_name;
                    var contributor = "Student tutored: " + json[i].first_name + " " + json[i].last_name;
                    var date = json[i].day;
                    var time = convertTime(json[i].start_time) + " to " + convertTime(json[i].end_time);
                    var summary = json[i].summary;

                    // Create and append new node with json information
                    var newArticle = $('<article class="meeting"><div class="course_contributor"><h3 class="subheading">' + title + '</h3>' +
                                        '<span class="contributor">' + contributor + '</span></div><div class="date_time"><span class="date">' + date + '</span>' +
                                        '<br><span class="time">' + time + '</span></div><span class="summary">' + summary + '</span></article>');
                    $('#tutor_history').append(newArticle);
                }
            }
        }
    });
});

// Toggle view of history
function toggleView() {
	var view = $('#history_view input[type="checkbox"]').prop('checked');

	// If on Student View
	if(view) {
		$('#tutor_history').fadeOut(200, function() {
			$('#student_history').fadeIn(100);
		});	
	}
	// Else on Tutor View
	else {
		$('#student_history').fadeOut(200, function() {
			$('#tutor_history').fadeIn(100);
		});	
	}
}

function showAddMeetingWindow() {
	$('#tutor_history #meeting_form').slideDown();
	$('#tutor_history article.add_meeting').animate({height: "350px"}, 400);
	
}

function hideAddMeetingWindow() {
	$('#tutor_history #meeting_form').slideUp();
	$('#tutor_history article.add_meeting').animate({height: "30px"}, 400);
}

function closeAndClearShare() {
    // Hide share window
    $('#share_window').fadeOut(200);

    // Hide show alert
    $('#share_alert').hide();

    // Clear all email boxes
    $('#share_window #share_form .share_email_holder div.share_email').remove();

    // Create new one
    var new_email = $('<div class="share_email"><label for="email">Email:</label><input type="email" name="email" placeholder="Enter an email"></div>');
    $('#share_window #share_form .share_email_holder').append(new_email);
}

// Create a JSON of all emails to share history with
function createEmailJSON() {
    // Put all emails in a JSON
    var emails = $('.share_email input[type="email"]');
    var emailsJSON = new Object();
    emailsJSON.emails = new Array();

    for(var i = 0; i < emails.length; i++) {
        var holder = emails.eq(i).val();
        if(holder !== "" && emailsJSON.emails.indexOf(holder) === -1) {
            emailsJSON.emails.push(holder);
        }
    }

    return JSON.stringify(emailsJSON);
}

function sendEmailJSON() {
    var json = createEmailJSON();

    // Parse JSON for emails
    $.ajax({
        type: "POST",
        url: "Laravel/public/users/email",
        data: {
            emails: json
        },
        success: function(json) {}
    });
}

function showView() {
    // Parse JSON for user info
    $.ajax({
        url: "Laravel/public/users/current",
        success: function(json) {
            json = JSON.parse(json);
            json = json[0];

            // Logged in
            if(json.length !== 0) {
                // If user not a tutor, don't allow to toggle views
                if(Number(json.tutor) === 0 || Number(json.active) === 0){
                    $('#history_view input[type="checkbox"]').prop('checked', true);
                    toggleView();
                }
                else {
                    $('label#history_view').show();
                    $('#history_view input[type="checkbox"]').prop('checked', false);
                    toggleView();
                }
            }
        }
    });
}

function fillNewMeetingCourses() {
    // Parse JSON for user info
    $.ajax({
        url: "Laravel/public/courses/showAll",
        success: function(json) {
            json = JSON.parse(json);

            for(var i = 0; i < json.length; i++){
                var title = json[i].subject + " " + json[i].course_number + ": " + json[i].course_name;
                var newOption = '<option value="' + json[i].course_id + '">' + title + '</option>';
                $('#meeting_form select[name="courses"]').append(newOption);
            }
        }
    });
}

function populateDateAndTime() {
    // Set date information
    var date = new Date();
    var year = date.getFullYear();
    var day = date.getDate();
    var month = date.getMonth() + 1;

    // If the day is less than 10, add a zero to the front
    if(day < 10){
        day = "0" + day.toString();
    }

    // If the month is less than 10, add a zero to the front
    if(month < 10){
        month = "0" + month.toString();
    }

    // Create the date string
    var date_string = year+"-"+month+"-"+day;

    // Populate the date
    $('#meeting_form input[type="date"]').val(date_string);

    // Set time information
    var end_time = date.getHours();
    var start_time = end_time - 1;

    // Create the time strings
    var start_time_string = start_time + ":00:00";
    var end_time_string = end_time + ":00:00";

    // Populate the time
    $('#meeting_form input[name="start_time"]').val(start_time_string);
    $('#meeting_form input[name="end_time"]').val(end_time_string);
}

function resetNewMeetingForm() {
    $("#meeting_form span.error").html("");
    
    // Reset Student ID
    $('#meeting_form input[name="student_id"]').val("");

    // Reset course selected
    $('#meeting_form select').val("");

    // Reset Date and Time
    populateDateAndTime();

    // Reset Summary
    $('#meeting_form textarea[name="summary"]').val("");
}

function createNewMeetingObject() {
    var new_meeting = new Object();
    new_meeting.student_id = $('#meeting_form input[name="student_id"]').val();
    new_meeting.course_id = $('#meeting_form select[name="courses"]').val();
    new_meeting.title = $('#meeting_form select option[value="' + new_meeting.course_id + '"]').html();
    new_meeting.day = $('#meeting_form input[type="date"]').val();
    new_meeting.start_time = $('#meeting_form input[name="start_time"]').val();
    new_meeting.end_time = $('#meeting_form input[name="end_time"]').val();
    new_meeting.summary = $('#meeting_form textarea[name="summary"]').val();

    return new_meeting;
}

function addNewMeeting(new_meeting) {
    console.log(new_meeting);
    var title = new_meeting.title;
    var contributor = "Student tutored: " + new_meeting.first_name + " " + new_meeting.last_name;
    var date = new_meeting.day;
    var time = convertTime(new_meeting.start_time) + " to " + convertTime(new_meeting.end_time);
    var summary = new_meeting.summary;

    // Create and append new node with json information
    var newArticle = $('<article class="meeting"><div class="course_contributor"><h3 class="subheading">' + title + '</h3>' +
                        '<span class="contributor">' + contributor + '</span></div><div class="date_time"><span class="date">' + date + '</span>' +
                        '<br><span class="time">' + time + '</span></div><span class="summary">' + summary + '</span></article>');

    var most_recent = $('#tutor_history article[class="meeting"]').eq(0);

    if(most_recent.length === 0){
        $('#tutor_history span.error.none').html("");
        $('#tutor_history').append(newArticle);
    }
    else {
        newArticle.insertBefore(most_recent);
    }
}