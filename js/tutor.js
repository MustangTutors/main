$(document).ready(function() {
	// Get the user_id from query in URL, then get tutor info
	var user_id = getURLParameter('user_id');

    // Hides the Your Rating section if the user is the same person as the tutor.
    $.ajax({
        type: "GET",
        url: "Laravel/public/users/current",
        success: function(json) {
            json = JSON.parse(json);
            if (json.length !== 0) {
                json = json[0];
                if (Number(json.user_id) !== Number(user_id)) {
                    $("#tutorProfilePage #yourRating").css('display', 'inline-block');
                }
            }
        }
    });

	var star = '<img src="img/star.png" alt="Rating Star">';
	var empty_star = '<img src="img/emptystar.png" alt="Rating Star">';
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var available = ["Unavailable", "Busy", "Available"];

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

            if (!tutorInfo.comments) {
                $("div#commentList ul").html("<div class='error'>This tutor doesn't have any comments yet.</div>");
            }
            else {
                for(var j = 0; j < tutorInfo.comments.length; j++) {

                    var oldTimestamp = moment(tutorInfo.comments[j].timeStamp, "YYYY-MM-DD HH:mm:ss");
                    var newTimestamp = oldTimestamp.format("YYYY-MM-DD hh:mm:ss A");

                    var comment = "<li><div class='comment'>";
                    comment += tutorInfo.comments[j].comment;
                    comment += "</div><div class='comment_info'><div class='comment_time'> Posted: ";
                    comment += newTimestamp;
                    comment += "</div><div class='comment_rating'>";
                    if (tutorInfo.comments[j].rating_from_commenter !== null) {
                        comment += "Tutor rating: " + convertToStars(tutorInfo.comments[j].rating_from_commenter);
                    }
                    comment += "</div></div></li>";
                    $("div#commentList ul").append(comment);
                }
            }
			
        }
    });

	$("input[name='addComment']").on('click', function() {
        $("div#commentList .error").remove();
		var comment = $("textarea[name='commentBox']").val();
		var fulldate = "Posted : "+moment().format("YYYY-MM-DD hh:mm:ss A");
		var rating = tutorInfo.current_user_rating;

		var li = $("<li><div class='comment'></div><div class='comment_info'><div class='comment_time'></div>" +
			"<div class='comment_rating'></div></div></li>");
		li.find('.comment').html(comment);
		li.find('.comment_time').html(fulldate);
        if (rating !== null) {
            li.find('.comment_rating').html("Tutor rating: " + convertToStars(rating));
        }
		

		$("div#commentList ul").prepend(li);
		$("textarea[name='commentBox']").val("");

		$.ajax ({
			type: 'POST',
			url: 'Laravel/public/tutor/comment',
			data: {
				tutor_id: user_id,
				comment: comment
			}
		});
	});

    $("#rating_cancel").on('click', function(event) {
        event.preventDefault();
    });

	$("body").on('click', function() {
		$("#editRating").hide();
	});

	$("img[src='img/pencil.png']").on('click', function(e) {
		if($("#editRating").is(":visible")) {
			$(".potential_rating img").remove();
			$("#editRating").hide();
			e.preventDefault();
			e.stopPropagation();
		}

		else {
			$(".potential_rating img").remove();
			e.preventDefault();
			$("#editRating").show();
			e.stopPropagation();

			for(var f = 5; f > 0; f--) {
				for(var j = 6-f; j > 0; j--) {
					$("#editRating div.potential_rating:nth-child("+(f+1)+")").append(star);
				}
				for(var k = 1; k < f; k++) {
					$("#editRating div.potential_rating:nth-child("+(f+1)+")").append(empty_star);
				}
			}
		}
	});

	$(".potential_rating").on('click', function() {
		$("span#yourRating h3 span").html($(this).html());
        $("span#yourRating h3 span").css('color', 'transparent');

        var rating = 0;

        for(var num_stars = 0; num_stars < $("span#yourRating h3 span img").length; num_stars++) {
        		if($("span#yourRating h3 span img").eq(num_stars).attr('src') === "img/star.png") {
        			rating++;
        		}
        }

		$.ajax ({
			type: 'POST',
			url: 'Laravel/public/tutor/rate',
			data: {
				tutorid: user_id,
				rating: rating
			},
            success: function(json) {
                json = JSON.parse(json);
                json = json[0];
                tutorInfo.current_user_rating = rating;
                $("span#averageRating h3 span").html(convertToStars(json.AVERAGE_RATING));
                $("span#averageRating h3 #num_ratings").html("Based on " + Number(json.NUMBER_OF_RATINGS) + " ratings");
            }
		});

		$(".potential_rating img").remove();
		$("#editRating").hide();
	});
});