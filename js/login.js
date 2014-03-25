$(document).ready(function() {
	$(document).on('submit', 'form#loginForm', function(e) {
		e.preventDefault();

		var id = $("input#login_id").val();
		var password = $("input#login_password").val();

		$("form#loginForm").hide();
		$("div#welcomeMessage").show();

		$("div#welcomeMessage span.welcome").append(id);
	});
});