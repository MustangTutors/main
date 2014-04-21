$(document).ready(function() {

	//var user_id = getURLParameter('user_id');
    var user_id;
    var fname;
    var lname;

	$.ajax({
        type: "GET",
        url: "Laravel/public/users/current",
        success: function(userInfo) {
            userInfo = JSON.parse(userInfo);

            user_id = userInfo[0].user_id;
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
                option += courses[i].course_id + " " + courses[i].subject + " " + courses[i].course_number + " " + courses[i].course_name;
                option += "</option>";
                $("select.course_dropdown").append(option);
            }
        }
    });

    var potential = 0;

	$("img[src='img/add.png']").on("click", function(e) {

		e.preventDefault();

		$("div#addCourses form").append(
			"<span class='potential_course'>" +
                "<select id='potential" + potential + "' class='course_dropdown'>" +
                 	"</select></span>"
		);

        $.ajax({
            type: "GET",
            url: "Laravel/public/courses/showAll",
            success: function(courses) {
                courses = JSON.parse(courses);
                //$("option").remove();
                for(var i = 0; i < courses.length; i++) {
                    var option = "<option>";
                    option += courses[i].course_id + " " + courses[i].subject + " " + courses[i].course_number + " " + courses[i].course_name;
                    option += "</option>";
                    var identifier = 'select#potential' + (potential-1);
                    $(identifier).append(option);
                    console.log(potential);
                }
            }
        });

        potential++;

		e.stopPropagation();

		var height = $("div#addCourses").height();

		if(height >= 220) {
			var new_height = $("section.applicant_info article").height();
			$("section.applicant_info article").height(new_height+34);
		}
		
	});

    $("button[type='submit']").on("click", function() {
        var application = {};

        application.User_ID = user_id;
        application.Courses = new Array();
        application.Hours = new Array();

        var selected_courses = $("select.course_dropdown");

        for(var i = 0; i < selected_courses.length; i++) {
            var new_course = selected_courses.eq(0).val();

            application.Courses[i] = {};

            var regex_id = /(\d)/;
            var course_id = regex_id.exec(new_course);
            application.Courses[i].Course_ID = course_id[0];

        }

        var days = $("article#potential_hours ul li input[type='checkbox']");
        var start_times = $("article#potential_hours ul li input.start_time");
        var end_times = $("article#potential_hours ul li input.end_time");

        var hour_index = 0;


        for(var i = 0; i < days.length; i++) {
            if(days.eq(i).is(":checked")) {
                application.Hours[hour_index] = {};
                application.Hours[hour_index].Day = i+1;
                application.Hours[hour_index].Start_Time = start_times.eq(i).val();
                application.Hours[hour_index].End_Time = end_times.eq(i).val();
                hour_index++;
            }
        }

        $.ajax({
            type: "POST",
            url: "Laravel/public/users/apply",
            data: {
                application: JSON.stringify(application)
            },
            success: function(output) {
                console.log("Sent something");
            }
        });

    });


});