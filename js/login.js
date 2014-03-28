$(document).ready(function() {
	$(document).on('submit', 'form#loginForm', function(e) {
		e.preventDefault();

		$.ajax({
            type: "POST",
            url: "Laravel/public/users/login",
            data: {
            	smu_id: $("input#login_id").val(),
            	password: $("input#login_password").val()
            },
            success: function(output) {
                $("input#login_id").val("");
                $("input#login_password").val("");
                if (output === "The user was not logged in properly") {
                    $("#loginForm .error").css('visibility', 'visible');
                }
                else {
                    $("#loginForm .error").css('visibility', 'hidden');
                    location.reload();
                }
            }
        });
	});

    $(document).on('click', '#logout', function(e) {
        e.preventDefault();

        $.ajax({
            type: "GET",
            url: "Laravel/public/users/logout",
            success: function(output) {
                location.reload();
            }
        });
    });
});