var list_of_course_ids = [];

// Get the user_id from query in URL, then get tutor info
var user_id = getURLParameter('user_id');

// Check if the user is logged in and an admin. If not, redirect to the tutor page
$.ajax({
    url: "Laravel/public/users/current",
    success: function(json) {
        json = JSON.parse(json);
        if (json.length === 0) {
            window.location.href = "tutor.html?user_id=" + user_id;
        }
        else if (json.length === 1 && Number(json[0].admin) !== 1) {
            window.location.href = "index.html?user_id=" + user_id;
        }
    }
});

$(document).ready(function() {

    // Hides the Your Rating section if the user is the same person as the tutor.
    // Also hides the comment form.
    $.ajax({
        type: "GET",
        url: "Laravel/public/users/current",
        success: function(json) {
            json = JSON.parse(json);
            if (json.length !== 0) {
                json = json[0];
                if (Number(json.user_id) !== Number(user_id)) {
                    $("#tutorProfilePage #yourRating").css('display', 'inline-block');
                    $("#tutorProfilePage #comment_form").show();
                }
                if (Number(json.admin) === 1) {
                    $("a#edit_link").attr("href", "tutor.html?user_id=" + user_id);
                    $("a#edit_link").show();
                }
            }
        }
    });

	var star = '<img src="img/star.png" alt="Rating Star">';
	var empty_star = '<img src="img/emptystar.png" alt="Rating Star">';
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var available = ["Unavailable", "Busy", "Available"];

	$("article.schedule").css("height", "295px");

    var tutorInfo;
	$.ajax({
        type: "GET",
        url: "Laravel/public/tutor/" + user_id,
        success: function(output) {

            tutorInfo = JSON.parse(output);

            // Set Tutor's name
            var name = tutorInfo.tutor_fName + " " + tutorInfo.tutor_lName;
            $("section#rating h2").html(name);

            // Set Tutor's profile picture
            var profile_pic = "img/tutors/" + tutorInfo.tutor_id + ".jpg";
            $(".tutorPicture img").attr('src', profile_pic);
 
            // Set Tutor's rating
            $("span#averageRating h3 span").html(convertToStars(tutorInfo.average_rating));

            var num_ratings = Number(tutorInfo.numberOfRatings);
            if (num_ratings !== 0) {
                $("span#averageRating h3 #num_ratings").html("Based on " + num_ratings + " ratings");
            }
            else {
                $("span#averageRating h3 #num_ratings").html("");
            }
			$("span#yourRating h3 span").html(convertToStars(tutorInfo.current_user_rating));

            // Set if Tutor is Active or Inactive
            if (Number(tutorInfo.active) === 0) {
                $("span#tutorpage_available").html("Disabled");
                $("span#tutorpage_available").addClass("disabled");
                // Set toggle to "Disabled"
                $('label.toggle#active_toggle_switch input[type="checkbox"]').prop('checked', true);
                setToggleColor("#active_toggle_switch");
            }
            else {
                $("span#tutorpage_available").html(available[tutorInfo.available]);
                $("span#tutorpage_available").addClass(available[tutorInfo.available].toLowerCase());
            }            
        }
    });

    populateCourses();
    populateHours();

    var potential = 0;

    // Add new course dropdown when add button clicked
    $("img[src='img/add.png']").on("click", function(e) {
        e.preventDefault();

        $("article#courses ul").append(
            "<li class='potential_course new_dropdown'>" +
                "<select id='potential" + potential + "' class='course_dropdown'>" +
                    "</select></li>");

        $.ajax({
            type: "GET",
            url: "Laravel/public/courses/showAll",
            success: function(courses) {
                courses = JSON.parse(courses);

                $("select.course_dropdown").eq(-1).append('<option value="" disabled selected>Choose a course</option>');

                for(var i = 0; i < courses.length; i++) {
                    var option = "<option value='" + courses[i].course_id + "'>";
                    option += courses[i].subject + " " + courses[i].course_number + ": " + courses[i].course_name;
                    option += "</option>";
                    var identifier = 'select#potential' + (potential-1);
                    $(identifier).append(option);
                }
            }
        });

        potential++;

        e.stopPropagation();

        var height = $("article#courses ul").height();

        if(height > 200) {
            var new_height = $("section.tutor_info article#courses").height();
            $("section.tutor_info article#courses").height(new_height+30);
        }
    });

    // Cancel changes to courses
    $("button[name='cancelCourseChanges']").on("click", function(e) {
        e.preventDefault();
        $("li.new_dropdown").remove();
        $("article#courses input[type='checkbox']").prop('checked', true);
    });

    // Cancel changes to hours
    $("button[name='cancelHourChanges']").on("click", function(e) {
        e.preventDefault();
        populateHours();
    });


    // Update courses when "save" is clicked
    $("button[name='saveCourseChanges']").on("click", function(e) {
        e.preventDefault();

        var courses = {};
        courses.User_ID = user_id;
        courses.Courses = [];

        var checkbox_courses = $("span.label input[type='checkbox']");
        var course_index = 0;
        var unique_courses = [];

        for(var i = 0; i < checkbox_courses.length; i++) {
            if(checkbox_courses.eq(i).is(":checked")) {
                unique_courses[course_index] = Number(list_of_course_ids[i]);
                course_index++;
            }
        }

        var selected_courses = $("select.course_dropdown");
        for(var i = 0; i < selected_courses.length; i++) {
            var new_course = selected_courses.eq(i).val();
            if (new_course) {
                unique_courses[course_index] = Number(new_course);
                course_index++;
            }
        }

        if (unique_courses.length === 0) {
            alert("Please select at least one course.");
        }
        else {
            for(var i = 0; i < unique_courses.length; i++) {
                courses.Courses[i] = {};
                courses.Courses[i].Course_ID = unique_courses[i];
            }
            $.ajax({
                type: "POST",
                url: "Laravel/public/courses/update",
                data: {
                    new_courses: JSON.stringify(courses)
                }
            });
            alert("Your changes have been saved.");
        }
    });

    // Update hours when "save" is clicked
    $("button[name='saveHourChanges']").on("click", function(e) {
        e.preventDefault();

        if (numSelectedDays() === 0) {
            alert("Please select at least one day.");
        }
        else if(checkHours()){
            var hours = {};
            hours.User_ID = user_id;
            hours.Hours = [];

            var days = $("article#hours ul li input[type='checkbox']");
            var start_times = $("article#hours ul li input.start_time");
            var end_times = $("article#hours ul li input.end_time");

            var hour_index = 0;


            for(var i = 0; i < days.length; i++) {
                if(days.eq(i).is(":checked")) {
                    hours.Hours[hour_index] = {};
                    hours.Hours[hour_index].Day = i+1;
                    hours.Hours[hour_index].Start_Time = start_times.eq(i).val();
                    hours.Hours[hour_index].End_Time = end_times.eq(i).val();
                    hour_index++;
                }
            }

            $.ajax({
                type: "POST",
                url: "Laravel/public/schedule/update",
                data: {
                    new_hours: JSON.stringify(hours)
                }
            });
            alert("Your changes have been saved.");
        }
        else {
            alert("Start times must come before end times.");
        }
    });

    // Toggle whether tutor is currently employed or not
    $(document).on('change', '#active_toggle_switch input[type="checkbox"]', function() {
        $.ajax({
            type: "GET",
            url: "Laravel/public/tutors/toggle/active/" + user_id,
            success: function(output) {
                if (output === "1") {
                    $("span#tutorpage_available").html(available[tutorInfo.available]);
                    $("span#tutorpage_available").removeClass("disabled");
                    $("span#tutorpage_available").addClass(available[tutorInfo.available].toLowerCase());
                }
                else if (output === "0") {
                    $("span#tutorpage_available").html("Disabled");
                    $("span#tutorpage_available").removeClass(available[tutorInfo.available].toLowerCase());
                    $("span#tutorpage_available").addClass("disabled");
                }
                console.log(output);
            }
        });
    });

    // When the enabled/disabled toggle switch is hovered, show a help message
    $(document).on("mouseover", "#active_toggle", function() {
        $("#active_toggle_message").show();
    });

    // When the enabled/disabled toggle switch is not hovered, hide the help message
    $(document).on("mouseout", "#active_toggle", function() {
        $("#active_toggle_message").hide();
    })

});

function populateHours() {
    $("article#hours ul").html(
        '<li>' +
            '<span class="potential_day">' +
                '<input type="checkbox" id="sunday">' +
                    '<label for="sunday">Sunday</label>' +
            '</span>' +
            '<span class="start_end">' +
                '<input type="time" class="start_time" value="00:00">' +
                '<span> to </span>' +
                '<input type="time" class="end_time" value="00:00">' +
            '</span>' +
        '</li>' +
                
        '<li>' +
            '<span class="potential_day">' +
                '<input type="checkbox" id="monday">' +
                '<label for="monday">Monday</label>' +
            '</span>' +
            '<span class="start_end">' +
                '<input type="time" class="start_time" value="00:00">' +
                '<span> to </span>' +
                '<input type="time" class="end_time" value="00:00">' +
            '</span>' +
        '</li>' +

        '<li>' +
            '<span class="potential_day">' +
                '<input type="checkbox" id="tuesday">' +
                '<label for="tuesday">Tuesday</label>' +
            '</span>' +
            '<span class="start_end">' +
                '<input type="time" class="start_time" value="00:00">' +
                '<span> to </span>' +
                '<input type="time" class="end_time" value="00:00">' +
            '</span>' +
        '</li>' +

        '<li>' +
            '<span class="potential_day">' +
                '<input type="checkbox" id="wednesday">' +
                '<label for="wednesday">Wednesday</label>' +
            '</span>' +
            '<span class="start_end">' +
                '<input type="time" class="start_time" value="00:00">' +
                '<span> to </span>' +
                '<input type="time" class="end_time" value="00:00">' +
            '</span>' +
        '</li>' +

        '<li>' +
            '<span class="potential_day">' +
                '<input type="checkbox" id="thursday">' +
                '<label for="thursday">Thursday</label>' +
            '</span>' +
            '<span class="start_end">' +
                '<input type="time" class="start_time" value="00:00">' +
                '<span> to </span>' +
                '<input type="time" class="end_time" value="00:00">' +
            '</span>' +
        '</li>' +

        '<li>' +
            '<span class="potential_day">' +
                '<input type="checkbox" id="friday">' +
                '<label for="friday">Friday</label>' +
            '</span>' +
            '<span class="start_end">' +
                '<input type="time" class="start_time" value="00:00">' +
                '<span> to </span>' +
                '<input type="time" class="end_time" value="00:00">' +
            '</span>' +
        '</li>' +

        '<li>' +
            '<span class="potential_day">' +
                '<input type="checkbox" id="saturday">' +
                '<label for="saturday">Saturday</label>' +
            '</span>' +
            '<span class="start_end">' +
                '<input type="time" class="start_time" value="00:00">' +
                '<span> to </span>' +
                '<input type="time" class="end_time" value="00:00">' +
            '</span>' +
        '</li>');

    $.ajax({
        type: "GET",
        url: "Laravel/public/tutor/" + user_id,
        success: function(json) {
            json = JSON.parse(json);
            json = json.hours;

            var days = $('article#hours .potential_day input[type="checkbox"]');
            var start_times = $('article#hours input.start_time[type="time"]');
            var end_times = $('article#hours input.end_time[type="time"]');

            for(var i = 0; i < json.length; i++){
                var index = json[i].day - 1;
                days.eq(index).prop('checked', true);
                start_times.eq(index).val(json[i].start_time);
                end_times.eq(index).val(json[i].end_time);
            }
        }
    });
}

function populateCourses(){
    $.ajax({
        type: "GET",
        url: "Laravel/public/tutor/" + user_id,
        success: function(json){
            json = JSON.parse(json);
            json = json.courses;
            // Loop through courses and add
            for(var i = 0; i < json.length; i++) {
                var index = i+1;
                var course = "<span class='label'>";
                course += "<input type='checkbox'>";
                course += json[i].subject + " " + json[i].course_number + ":";
                course += "</span><span class='content'>";
                course += json[i].course_name;
                course += "</span>";
                $("article#courses ul").append("<li>");
                $("article#courses ul li:nth-child("+index+")").append(course);
                $("article#courses ul").append("</li>");
                list_of_course_ids[i] = json[i].course_id;
            }

            $("article#courses input[type='checkbox']").prop('checked', true);
        }
    });
}

function numSelectedDays() {
    return $('article#hours .potential_day input[type="checkbox"]:checked').length;
}

function checkHours(){
    var days = $('article#hours .potential_day input[type="checkbox"]');
    var start_times = $('article#hours input.start_time[type="time"]');
    var end_times = $('article#hours input.end_time[type="time"]');

    for(var i = 0; i < days.length; i++) {
        if(days.eq(i).prop('checked')){
            if(end_times.eq(i).val() <= start_times.eq(i).val()){
                return false;
            }
        }
    }

    return true;
}