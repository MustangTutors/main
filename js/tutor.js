$(document).ready(function() {
	// Get the user_id from query in URL, then get tutor info
	var user_id = getURLParameter('user_id');
	$.ajax({
        type: "GET",
        url: "Laravel/public/tutor/" + user_id,
        success: function(output) {
            var json = JSON.parse(output);
            console.log(json);
            $("span#averageRating h3 span").append(convertToStars(json.average_rating));
			$("span#yourRating h3 span").html(convertToStars(json.current_user_rating));
        }
    });

	var star = '<img src="img/star.png" alt="Rating Star">';
	var empty_star = '<img src="img/emptystar.png" alt="Rating Star">';

	$("input[name='addComment']").on('click', function() {
		var date = new Date();

		var month = date.getMonth()+1;
		var day = date.getDate();
		var year = date.getFullYear();

		var fulldate = "Posted on "+month+"/"+day+"/"+year;

		var begItem = "<li>";
		var endItem = "</li>";
		var begDiv = "<div>";
		var endDiv = "</div>";
		var comment = $("textarea[name='commentBox']").val();
		comment = begItem+begDiv+comment+endDiv+begDiv+fulldate+endDiv+endItem;
		$("div#commentList ul").prepend(comment);
		$("textarea[name='commentBox']").val("");
	});

	$("body").on('click', function() {
		$("#editRating").hide();
	});

	$("img[src='img/pencil.png']").on('click', function(e) {
		if($("#editRating").is(":visible")) {
			$(".potential_rating span img").remove();
			$("#editRating").hide();
			e.preventDefault();
			e.stopPropagation();
		}

		else {
			$(".potential_rating span img").remove();
			e.preventDefault();
			$("#editRating").show();
			e.stopPropagation();

			for(var f = 5; f > 0; f--) {
				for(var j = 6-f; j > 0; j--) {
					$("#editRating div.potential_rating:nth-child("+(f+1)+") span").append(star);
				}
				for(var k = 1; k < f; k++) {
					$("#editRating div.potential_rating:nth-child("+(f+1)+") span").append(empty_star);
				}
			}
		}
	});

	$(".potential_rating span").on('click', function() {
		$("span#yourRating h3 span").html($(this).html());
		$(".potential_rating span img").remove();
		$("#editRating").hide();
	});
});