$(document).ready(function() {

	var user_id = getURLParameter('user_id');

	$.ajax({
        type: "GET",
        url: "Laravel/public/users/current/" + user_id,
        success: function(userInfo) {
            userInfo = JSON.parse(userInfo);

            var name = userInfo[0].fName + " " + userInfo[0].lName;
            var email = userInfo[0].email;

            $("section#contact h2:nth-child(odd)").html(name);
            $("section#contact h2:nth-child(even)").html(email);

        }
    });

	$("img[src='img/add.png']").on("click", function(e) {

		e.preventDefault();
		$("div#addCourses form").append(
			"<span class='potential_course'>" +
                "<select class='course_dropdown'>" +
                    "<option>CSE 2341: Data Structures</option>" +
                    "<option>CSE 1342: Programming Concepts</option>" +
                    "<option>PHIL 1318: Contemporary Moral Problems</option>" +
                    "<option>STAT 4340: Statistics for Engineers</option>" +
                    "<option>MATH 1338: Calculus II</option>" +
                    "<option>EE 1301: Modern Electronic Technology</option>" +
                 	"</select>" +
            "</span>"
		);
		e.stopPropagation();

		var height = $("div#addCourses").height();

		if(height >= 220) {
			var new_height = $("section.applicant_info article").height();
			$("section.applicant_info article").height(new_height+34);
		}
		
	});



});