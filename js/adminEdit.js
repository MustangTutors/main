$(document).ready(function() {

	// Get the user_id from query in URL, then get tutor info
	var user_id = getURLParameter('user_id');

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
			}
        }
    });

    $.ajax({
        type: "GET",
        url: "Laravel/public/courses/showAll",
        success: function(courses) {
            courses = JSON.parse(courses);
            //$("option").remove();
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
                //$("option").remove();
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
        courses.Courses = new Array();

        var selected_courses = $("select.new_dropdown");

        for(var i = 0; i < selected_courses.length; i++) {
            var new_course = selected_courses.eq(0).val();

            courses.Courses[i] = {};

            var regex_id = /(\d)/;
            var course_id = regex_id.exec(new_course);
            courses.Courses[i].Course_ID = course_id[0];

        }

        $.ajax({
            type: "GET",
            url: "Laravel/public/courses/update",
            data: {
                new_courses: JSON.stringify(courses)
            }
        });
    });

    $("button[name='saveHourChanges']").on("click", function(e) {
        e.preventDefault();

        var hours = {};
        hours.User_ID = user_id;
        hours.Hours = new Array();

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
            type: "GET",
            url: "Laravel/public/schedule/update",
            data: {
                new_hours: JSON.stringify(hours)
            }
        });
    });
});