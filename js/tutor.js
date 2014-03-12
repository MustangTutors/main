$(document).ready(function() {
	$("input[name='addComment']").on('click', function() {
		var begItem = "<li>";
		var endItem = "</li>";
		var comment = $("textarea[name='commentBox']").val();
		console.log(comment);
		comment = begItem+comment+endItem;
		$("div#commentList ul").prepend(comment);
		$("textarea[name='commentBox']").val("");
	});
});