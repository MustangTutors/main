$(document).ready(function(){
    $(document).on('submit', 'form', function(event){
        event.preventDefault();
        clearMeetings();
        loadMeetings();
    });
});

function loadMeetings () {
    // Parse JSON for student meetings
    $.ajax({
        type: "POST",
        url: "Laravel/public/users/history/parent",
        data: {
            smu_id: $('#search_bar #search_student_id').val(),
            codeword: $('#search_bar #search_codeword').val()
        },
        success: function(json) {
            if(json === "incorrect codeword"){
                alert("That SMU student ID did not match that code word.");
            }
            else {
                json = JSON.parse(json);
                if(json.length === 0) {
                    $('#results span.error.none').html('This user has not yet attended any tutoring sessions.');
                }
                else {
                    console.log(json);
                    // Insert search result title
                    $.ajax({
                        type: "GET",
                        url: "Laravel/public/users/current/" + json[0].user_id,
                        success: function(json) {
                            json = JSON.parse(json);
                            json = json[0];
                            var heading = "Results for " + json.fName + " " + json.lName + " ("+ json.smu_id +")";
                            $('#results #results_name').html(heading);
                        }
                    });
                    for(var i = 0; i < json.length; i++) {
                        // Assign json values
                        var title = json[i].subject + " " + json[i].course_number + ": " + json[i].course_name;
                        var contributor = "Tutored by: " + json[i].first_name + " " + json[i].last_name;
                        var date = json[i].day;
                        var time = json[i].start_time + " to " + json[i].end_time;
                        var summary = json[i].summary;

                        // Create and append new node with json information
                        var newArticle = $('<article class="meeting"><div class="course_contributor"><h3 class="subheading">' + title + '</h3>' +
                                            '<span class="contributor">' + contributor + '</span></div><div class="date_time"><span class="date">' + date + '</span>' +
                                            '<br><span class="time">' + time + '</span></div><span class="summary">' + summary + '</span></article>');
                        $('#results').append(newArticle);
                    }
                }
                showMeetings();
            }
        }
    });
}

function showMeetings () {
    $('#results').slideDown();
}

function clearMeetings () {
    $('#results #results_name').html('');
    $('#results span.error').html('');
    $('.meeting').remove();
}