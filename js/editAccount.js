$(document).ready(function(){
    // Check if the user is logged in. If they are not, redirect to index.html
    var user = {};
    $.ajax({
        url: "Laravel/public/users/current",
        success: function(json) {
            json = JSON.parse(json);
            if (json.length === 0) {
                window.location.href = "index.html";
            }
            user = json[0];
            $("#edit_first").val(user['fName']);
            $("#edit_last").val(user['lName']);
        }
    });

    $(document).on('submit', 'form#editAccountForm', function(event){
        event.preventDefault();

        var password = $("#edit_new_password").val();
        // If the new password field is not blank, check that it matches the confirmation
        if (password !== "") {
            var checkPass = $("#edit_password_confirm").val();
            if(password !== checkPass) {
                $("#editAccount .error").html("Error: Password confirmation did not match.<br/><br/>");
                return;
            }
        }

        // Check that the inputted current password matches the logged in user's password
        $.ajax({
            type: "POST",
            url: "Laravel/public/users/login",
            data: {
                smu_id: user['smu_id'],
                password: $("input#edit_current_password").val()
            },
            success: function(output) {
                if (output === "The user was not logged in properly") {
                    $("#editAccount .error").html("Error: The current password is incorrect.<br/><br/>");
                }
                else {
                    // $.ajax({
                    //     type: "POST",
                    //     url: "",
                    //     data: $(this).serialize(),
                    //     success: function(output) {
                            
                    //     }
                    // });

                    // Clear the error message
                    $("#editAccount .error").html("");
                    // Clear fields in form
                    $("#edit_new_password").val("");
                    $("#edit_password_confirm").val("");
                    $("#edit_current_password").val("");
                    // Display a success message
                    alert("Your account information has been updated!");
                }
            }
        });
    });
});