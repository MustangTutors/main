$(document).ready(function() {
	// Get the user_id from query in URL, then get tutor info
	var user_id = getURLParameter('user_id');

	var star = '<img src="img/star.png" alt="Rating Star">';
	var empty_star = '<img src="img/emptystar.png" alt="Rating Star">';
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
	"Friday", "Saturday"];
	var available = ["Unavailable", "Busy", "Available"];


	$.ajax({
        type: "GET",
        url: "Laravel/public/tutor/" + user_id,
        success: function(output) {
            var json = JSON.parse(output);
            console.log(json);

            var name = json.tutor_fName + " " + json.tutor_lName;
            $("section#rating h2").html(name);

            var profile_pic = "img/tutors/" + json.tutor_id + ".jpg";
            console.log(profile_pic);
            $(".tutorPicture img").attr('src', profile_pic);
 
            $("span#averageRating h3 span").html(convertToStars(json.average_rating));
			$("span#yourRating h3 span").html(convertToStars(json.current_user_rating));

			$("span#tutorpage_available").html(available[json.available]);

			for(var i = 0; i < json.courses.length; i++) {
				var index = i+1;
				var course = "<span class='label'>";
				course += json.courses[i].subject+" "+json.courses[i].course_number+":";
				course += "</span><span class='content'>";
				course += json.courses[i].course_name;
				course += "</span>";
				$("article#courses ul").append("<li>");
				$("article#courses ul li:nth-child("+index+")").append(course);
				$("article#courses ul").append("</li>");
			}

			for(var f = 0; f < json.hours.length; f++) {
				var day = f-1;
				var index = f+1;
				var hour = "<span class='day'>";
				hour += days[json.hours[f].day-1];
				hour += " </span><span>";
				hour += convertTime(json.hours[f].start_time)+" to "+convertTime(json.hours[f].end_time);
				hour += "</span>"
				$("article#hours ul").append("<li>");
				$("article#hours ul li:nth-child("+index+")").append(hour);
				$("article#hours ul").append("</li>");
			}

			for(var j = 0; j < json.comments.length; j++) {

				var oldTimestamp = moment(json.comments[j].timeStamp, "YYYY-MM-DD HH:mm:ss");
				var newTimestamp = oldTimestamp.format("YYYY-MM-DD hh:mm:ss A");

				var comment = "<li><div class='comment'>";
				comment += json.comments[j].comment;
				comment += "</div><div class='comment_info'><div class='comment_time'> Posted: ";
				comment += newTimestamp;
				comment += "</div><div class='comment_rating'> Tutor rated: ";
				comment += convertToStars(json.comments[0].rating_from_commenter);
				comment += "</div></div></li>";
				$("div#commentList ul").prepend(comment)
			}
			
        }
    });

	$("input[name='addComment']").on('click', function() {

		var comment = $("textarea[name='commentBox']").val();
		var fulldate = "Posted : "+moment().format("YYYY-MM-DD hh:mm:ss A");
		var rating = $(json.current_user_rating);

		var li = $("<li><div class='comment'></div><div class='comment_info'><div class='comment_time'></div>" +
			"<div class='comment_rating'></div></div></li>");
		li.find('.comment').html(comment);
		li.find('.comment_time').html(fulldate);
		li.find('.comment_rating').html(rating);

		$("div#commentList ul").prepend(li);
		$("textarea[name='commentBox']").val("");

		$.ajax {
			type: 'POST',
			url: 'Laravel/tutor/comment',
			data: {
				user_id: user_id,
				tutor_id: json.tutor_id,
				comment: comment
			},
			success: function(output) {

			}
		}
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

	$(".potential_rating span").on('click', function() {
		$("span#yourRating h3 span").html($(this).html());
		$(".potential_rating img").remove();
		$("#editRating").hide();
	});
});