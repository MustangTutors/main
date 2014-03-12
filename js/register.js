$(document).ready(function(){
    $(document).on('submit', 'form', function(event){
        event.preventDefault();

        var password = $("#registration_password").val();
        var checkPass = $("#registration_confirm").val();

        if(password !== checkPass) {
            $(".error").html("Error: Password confirmation did not match.<br/><br/>");
        }
        else {
            // $.ajax({
            //     type: "POST",
            //     url: "api/AddNewUser",
            //     data: $(this).serialize(),
            //     success: function(output) {
            //         if (output === "null") {
            //             $(".error").html("Error: That email already exists.<br/><br/>");
            //         }
            //         else {
            //             $.ajax({
            //                 type: "POST",
            //                 url: "api/users/login",
            //                 data: {
            //                     email: $("#registration input[name='email']").val(),
            //                     password: $("#registration input[name='password']").val()
            //                 },
            //                 success: function(data) {
            //                     window.location.replace("index.html");
            //                 }
            //             });
            //         }
            //     }
            // });
            $(".error").html("");
        }
    });
});