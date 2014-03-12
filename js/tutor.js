$(document).ready(function() {
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

	var star = '<img src="img/star.png" alt="Rating Star">';

	for(var i = 0; i < 5; i++) {
		$("span#averageRating h3 span").append(star);
		$("span#yourRating h3 span").append(star);
	}
});