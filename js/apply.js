$(document).ready(function() {

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