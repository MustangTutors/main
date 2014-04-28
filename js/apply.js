// Check if the user is logged in. If not, redirect to findstudent.html
$.ajax({
    url: "Laravel/public/users/current",
    success: function(json) {
        json = JSON.parse(json);
        if (json.length === 0) {
            window.location.href = "index.html";
        }
    }
});

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

            checkApplicationStatus(user_id);

            var name = fname + " " + lname;
            var email = userInfo[0].email;

            $("section#contact h2:nth-child(odd)").html(name);
            $("section#contact h2:nth-child(even)").html(email);

            $("select.course_dropdown").append("<option></option>");
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
                    "<option></option>" +
                     	"</select></span>"
		);

        $.ajax({
            type: "GET",
            url: "Laravel/public/courses/showAll",
            success: function(courses) {
                courses = JSON.parse(courses);
                for(var i = 0; i < courses.length; i++) {
                    var option = "<option>";
                    option += courses[i].course_id + " " + courses[i].subject + " " + courses[i].course_number + " " + courses[i].course_name;
                    option += "</option>";
                    var identifier = 'select#potential' + (potential-1);
                    $(identifier).append(option);
                }
            }
        });

        potential++;

		e.stopPropagation();

		var height = $("div#addCourses").height();

		if(height > 240) {
			var new_height = $("section.applicant_info article").height();
			$("section.applicant_info article").height(new_height+34);
		}
		
	});

    $("img[src='img/delete.png']").on("click", function(e) {

        e.preventDefault();

        $("span.potential_course:last-of-type()").remove();

        var height = $("div#addCourses").height();

        if(height >= 220) {
            var new_height = $("section.applicant_info article").height();
            $("section.applicant_info article").height(new_height-34);
        }

    });

    $("button[type='submit']").on("click", function() {
        var application = {};

        application.User_ID = user_id;
        application.Courses = new Array();
        application.Hours = new Array();

        var selected_courses = $("select.course_dropdown");
        var unique_courses = [];

        for(var i = 0; i < selected_courses.length; i++) {
            var new_course = selected_courses.eq(i).val();

            application.Courses[i] = {};

            var regex_id = /(\d)/;
            var course_id = regex_id.exec(new_course);
            unique_courses[i] = course_id[0];         
        }
        unique_courses = $.unique(unique_courses);

        for(var i = 0; i < unique_courses.length; i++) {
            application.Courses[i].Course_ID = unique_courses[i];
        }

        var days = $("article#potential_hours ul li input[type='checkbox']");
        var start_times = $("article#potential_hours ul li input.start_time");
        var end_times = $("article#potential_hours ul li input.end_time");

        var checked_days = $("article#potential_hours ul li input[type='checkbox']:checked");

        var hour_index = 0;

        if(checked_days.length === 0) {
            $("span#hour_error").show();
        }

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
                application: JSON.stringify(application),
                photo: $("input#addProfilePicture").val()
            }
        });

    });

});

function checkApplicationStatus(id) {
    $.ajax({
        type: "GET",
        url: "Laravel/public/users/apply/status/" + id,
        success: function(status) {
            console.log(status);
            if(status === "1") {
                console.log("Status");
                $("article#potential_hours ul").html("Pending. . .");
                $("article#potential_courses form").html("Pending. . .");
                $("article#potential_courses form").css("width", "76px");
                $("img[src='img/add.png']").hide();
                $("button[type='submit']").hide();
                $("input#addProfilePicture").hide();
                $("label[for='addProfilePicture']").hide();
            }
        }
    });
}