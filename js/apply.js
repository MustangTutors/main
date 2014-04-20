$(document).ready(function() {

	var user_id = getURLParameter('user_id');
    var fname;
    var lname;

	$.ajax({
        type: "GET",
        url: "Laravel/public/users/current/" + user_id,
        success: function(userInfo) {
            userInfo = JSON.parse(userInfo);

            fname = userInfo[0].fName;
            lname = userInfo[0].lName;

            var name = fname + " " + lname;
            var email = userInfo[0].email;

            $("section#contact h2:nth-child(odd)").html(name);
            $("section#contact h2:nth-child(even)").html(email);

        }
    });

    $.ajax({
        type: "GET",
        url: "Laravel/public/courses/showAll",
        success: function(courses) {
            courses = JSON.parse(courses);
            for(var i = 0; i < courses.length; i++) {
                var option = "<option>";
                option += courses[i].subject + " " + courses[i].course_number + " " + courses[i].course_name;
                option += "</option>";
                $("select.course_dropdown").append(option);
            }
        }
    });

	$("img[src='img/add.png']").on("click", function(e) {

		e.preventDefault();

		$("div#addCourses form").append(
			"<span class='potential_course'>" +
                "<select class='course_dropdown'>" +
                 	"</select></span>"
		);

        $.ajax({
            type: "GET",
            url: "Laravel/public/courses/showAll",
            success: function(courses) {
                courses = JSON.parse(courses);
                for(var i = 0; i < courses.length; i++) {
                    var option = "<option>";
                    option += courses[i].subject + " " + courses[i].course_number + " " + courses[i].course_name;
                    option += "</option>";
                    $("select.course_dropdown").append(option);
                }
            }
        });
        
		e.stopPropagation();

		var height = $("div#addCourses").height();

		if(height >= 220) {
			var new_height = $("section.applicant_info article").height();
			$("section.applicant_info article").height(new_height+34);
		}
		
	});

    var application = {};

    application.User_ID = user_id;
    application.First_Name = fname;
    application.Last_Name = lname;
    application.Courses = new Array();

});