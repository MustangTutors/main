$(document).ready(function() {

	// Get the user_id from query in URL, then get tutor info
	var user_id = getURLParameter('user_id');

    $("section.tutor_info").removeClass("admin_tutor_info");
    $(".edit_button").hide();

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
            }
        }
    });

	var star = '<img src="img/star.png" alt="Rating Star">';
	var empty_star = '<img src="img/emptystar.png" alt="Rating Star">';
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var available = ["Unavailable", "Busy", "Available"];

	$("article.schedule").css("height", "295px");

    var list_of_course_ids = [];
    var list_of_days = [null, null, null, null, null, null, null];
    var list_of_start_times = [null, null, null, null, null, null, null];
    var list_of_end_times = [null, null, null, null, null, null, null];

    var tutorInfo;
	$.ajax({
        type: "GET",
        url: "Laravel/public/tutor/" + user_id,
        success: function(output) {

            tutorInfo = JSON.parse(output);

            var name = tutorInfo.tutor_fName + " " + tutorInfo.tutor_lName;
            $("section#rating h2").html(name);

            var profile_pic = "img/tutors/" + tutorInfo.tutor_id + ".jpg";
            $(".tutorPicture img").attr('src', profile_pic);
 
            $("span#averageRating h3 span").html(convertToStars(tutorInfo.average_rating));
            $("span#averageRating h3 #num_ratings").html("Based on " + Number(tutorInfo.numberOfRatings) + " ratings");
			$("span#yourRating h3 span").html(convertToStars(tutorInfo.current_user_rating));

            if (Number(tutorInfo.active) === 1) {
                $("span#tutorpage_available").html(available[tutorInfo.available]);
                $("span#tutorpage_available").addClass(available[tutorInfo.available].toLowerCase());
            }
            else {
                $("span#tutorpage_available").html("Disabled");
                $("span#tutorpage_available").addClass("disabled");
            }

			for(var i = 0; i < tutorInfo.courses.length; i++) {
				var index = i+1;
				var course = "<span class='label'>";
                course += "<input type='checkbox'>";
				course += tutorInfo.courses[i].subject+" "+tutorInfo.courses[i].course_number+":";
				course += "</span><span class='content'>";
				course += tutorInfo.courses[i].course_name;
				course += "</span>";
				$("article#courses ul").append("<li>");
				$("article#courses ul li:nth-child("+index+")").append(course);
				$("article#courses ul").append("</li>");
                list_of_course_ids[i] = tutorInfo.courses[i].course_id;
			}

            if (!tutorInfo.hours) {
                tutorInfo.hours = [];
            }
            for(var dayIndex = 0, tutorDayIndex = 0; dayIndex < days.length; dayIndex++) {
                var day = $('<li><span class="day"></span><span class="content"></span></li>');
                day.find('.day').html(days[dayIndex]);
                if ((tutorDayIndex < tutorInfo.hours.length) && (Number(tutorInfo.hours[tutorDayIndex].day)-1 === dayIndex)) {
                    day.find('.content').html(convertTime(tutorInfo.hours[tutorDayIndex].start_time)+" to "+convertTime(tutorInfo.hours[tutorDayIndex].end_time));
                    
                    list_of_days[dayIndex] = Number(tutorInfo.hours[tutorDayIndex].day);
                    
                    list_of_start_times[dayIndex] = tutorInfo.hours[tutorDayIndex].start_time;

                    list_of_end_times[dayIndex] = tutorInfo.hours[tutorDayIndex].end_time;

                    tutorDayIndex++;
                }
                else {
                    day.find('.content').html("N/A");
                }
                $("article#hours ul").append(day);
            }

            $("input[type='checkbox']").hide();
        }
    });

    $.ajax({
        type: "GET",
        url: "Laravel/public/courses/showAll",
        success: function(courses) {
            courses = JSON.parse(courses);
            for(var i = 0; i < courses.length; i++) {
                var option = "<option>";
                option += courses[i].course_id + " " + courses[i].subject + " " + courses[i].course_number + " " + courses[i].course_name;
                option += "</option>";
                $("select.course_dropdown").append(option);
            }
        }
    });

    var potential = 0;

    $("img[src='img/add.png']").on("click", function(e) {

        e.preventDefault();

        $("article#courses ul").append(
            "<li class='potential_course new_dropdown'>" +
                "<select id='potential" + potential + "' class='course_dropdown'>" +
                    "</select></li>"
        );

        $.ajax({
            type: "GET",
            url: "Laravel/public/courses/showAll",
            success: function(courses) {
                courses = JSON.parse(courses);
                for(var i = 0; i < courses.length; i++) {
                    var option = "<option>";
                    option += courses[i].course_id + " " + courses[i].subject + " " + courses[i].course_number + " " + courses[i].course_name;
                    option += "</option>";
                    var identifier = 'select#potential' + (potential-1);
                    $(identifier).append(option);
                }
            }
        });

        potential++;

        e.stopPropagation();

        var height = $("article#courses ul").height();

        if(height > 143) {
            var new_height = $("section.tutor_info article").height();
            $("section.tutor_info article").height(new_height+30);
        }
        
    });

    $("article#courses img[src='img/pencil.png']").on("click", function(e) {
        e.preventDefault();
        $("section.tutor_info").addClass("admin_tutor_info");
        $("article#courses .edit_button").show();
        $("input[type='checkbox']").show();
        $("span.label input[type='checkbox']").prop("checked", true);
    });

    $("article#hours img[src='img/pencil.png']").on("click", function(e) {
        e.preventDefault();
        $("section.tutor_info").addClass("admin_tutor_info");
        $("article#hours .edit_button").show();
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

        var days = $("article#hours ul li input[type='checkbox']");
        var start_times = $("article#hours ul li input.start_time");
        var end_times = $("article#hours ul li input.end_time");

        for(var i = 0; i < list_of_days.length; i++) {
            if(list_of_days[i] !== null) {
                days.eq(i).prop("checked", true);
                start_times.eq(i).val(list_of_start_times[i].substring(0, 5));
                end_times.eq(i).val(list_of_end_times[i].substring(0, 5));
            }
        }
    });

    $("button[name='cancelCourseChanges']").on("click", function(e) {
        e.preventDefault();

        $("li.new_dropdown").remove();
        $("section.tutor_info article").height(295);
    });

    $("button[name='cancelHourChanges']").on("click", function(e) {
        e.preventDefault();

        $("input[type='time']").val("00:00");
    });

    $("button[name='saveCourseChanges']").on("click", function(e) {
        e.preventDefault();

        var courses = {};
        courses.User_ID = user_id;
        courses.Courses = [];

        var checkbox_courses = $("span.label input[type='checkbox']");
        var course_index = 0;

        for(var i = 0; i < checkbox_courses.length; i++) {
            if(checkbox_courses.eq(i).is(":checked")) {
                courses.Courses[course_index] = {};
                courses.Courses[course_index].Course_ID = list_of_course_ids[i];
                course_index++;
            }
        }

        var selected_courses = $("select.course_dropdown");

        for(var i = 0; i < selected_courses.length; i++) {
            var new_course = selected_courses.eq(i).val();

            courses.Courses[course_index] = {};

            var regex_id = /(\d)/;
            var course_id = regex_id.exec(new_course);
            courses.Courses[course_index].Course_ID = course_id[0];
            course_index++;

        }

        $.ajax({
            type: "POST",
            url: "Laravel/public/courses/update",
            data: {
                new_courses: JSON.stringify(courses)
            }
        });
        $("span#course_confirmation").show();
        $("button[name='saveCourseChanges']").css("margin-top", -20);
        $("button[name='cancelCourseChanges']").css("margin-top", -20);
    });

    $("button[name='saveHourChanges']").on("click", function(e) {
        e.preventDefault();

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
        $("span#hour_confirmation").show();
        $("button[name='saveHourChanges']").css("margin-top", -20);
        $("button[name='cancelHourChanges']").css("margin-top", -20);
    });

    $(document).on('change', '#toggleButton input[type="checkbox"]', function() {
        $.ajax({
            type: "GET",
            url: "Laravel/public/tutors/toggle/active/" + user_id
        });
    });

});