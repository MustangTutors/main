$(document).ready(function(){
    $(document).on('submit', 'form', function(event){
        event.preventDefault();

        var password = $("#registration_password").val();
        var checkPass = $("#registration_confirm").val();

        if(password !== checkPass) {
            $(".error").html("Error: Password confirmation did not match.<br/><br/>");
        }
        else {
            $.ajax({
                type: "POST",
                url: "Laravel/public/users/register",
                data: $(this).serialize(),
                success: function(output) {
                    if (output === "The ID provided has already been registered." || output === "[]") {
                        $(".error").html("Error: That SMU ID or email already exists.<br/><br/>");
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
            $(".error").html("");
        }
    });
});