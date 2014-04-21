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

	$("article.schedule").css("height", "225px");

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

			for(var dayIndex = 0, tutorDayIndex = 0; dayIndex < days.length; dayIndex++) {
                var day = $('<li><span class="day"></span><span class="content"></span></li>');
                day.find('.day').html(days[dayIndex]);
                if ((tutorDayIndex < tutorInfo.hours.length) && (Number(tutorInfo.hours[tutorDayIndex].day)-1 === dayIndex)) {
                    day.find('.content').html(convertTime(tutorInfo.hours[tutorDayIndex].start_time)+" to "+convertTime(tutorInfo.hours[tutorDayIndex].end_time));
                    tutorDayIndex++;
                }
                else {
                    day.find('.content').html("N/A");
                }
                $("article#hours ul").append(day);
			}
        }
    });
});