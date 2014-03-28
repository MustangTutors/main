$(document).ready(function() {
	$(document).on('submit', 'form#loginForm', function(e) {
		e.preventDefault();

		$("form#loginForm").hide();
		$("div#welcomeMessage").show();

		$.ajax({
                type: "POST",
                url: "Laravel/public/users/login",
                data: {
                	smu_id: $("input#login_id").val(),
                	password: $("input#login_password").val()
                },
                success: function(output) {
                    if (output === "The user was not logged in properly") {
                        $(".error").html("Error: The user id and password do not match our records.<br/><br/>");
                        $("input#login_id").val("");
                		$("input#login_password").val("");
                    }
                    else {
                        output = JSON.parse(output);
                    	$("form#loginForm").hide();
                    	$("div#welcomeMessage").show();
                    	$("div#welcomeMessage span.welcome").append(output[0].fName);
                    }
                }
            });
	});
});