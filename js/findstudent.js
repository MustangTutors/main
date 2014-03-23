var loaded = false;

$(document).ready(function(){
    $(document).on('submit', 'form', function(event){
        event.preventDefault();
        $('#article span.error').html('');
        clearMeetings();
        loadMeetings();
    });
});

function loadMeetings () {
    // Parse JSON for student meetings
    $.ajax({
        url: "json/student_history.json",
        success: function(json) {
            if(json.meetings.length === 0) {
                $('#results span.error').html('This user has not yet attended any tutoring sessions.');
            }
            else {
                json = json.meetings;
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
    });
}

function showMeetings () {
    $('#results').slideDown();
}

function clearMeetings () {
    $('.meeting').remove();
}