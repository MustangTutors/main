// Check if the user is logged in. If they are, redirect to index.html
$.ajax({
    url: "Laravel/public/users/current",
    success: function(json) {
        json = JSON.parse(json);
        if (json.length !== 0) {
            window.location.href = "index.html";
        }
    }
});

$(document).ready(function(){
    $(document).on('submit', 'form#registrationForm', function(event){
        event.preventDefault();

        var password = $("#registration_password").val();
        var checkPass = $("#registration_confirm").val();

        if(password !== checkPass) {
            $("#registration .error").html("Error: Password confirmation did not match.<br/><br/>");
        }
        else {
            $.ajax({
                type: "POST",
                url: "Laravel/public/users/register",
                data: $(this).serialize(),
                success: function(output) {
                    if (output === "The ID provided has already been registered.") {
                        $("#registration .error").html("Error: Someone already registered with that SMU ID.<br/><br/>");
                    }
                    else if (output === "The email address provided has already been registered.") {
                        $("#registration .error").html("Error: Someone already registered with that email.<br/><br/>");
                    }
                    else if (output === "Please provide a different codeword.") {
                        $("#registration .error").html("Error: Someone is already using that codeword.<br/><br/>");
                    }
                    else {
                        $.ajax({
                            type: "POST",
                            url: "Laravel/public/users/login",
                            data: {
                                smu_id: $("#registrationForm input[name='smu_id']").val(),
                                password: $("#registrationForm input[name='password']").val()
                            },
                            success: function(data) {
                                window.location.replace("index.html");
                            }
                        });
                    }
                }
            });
            $("#registration .error").html("");
        }
    });
});