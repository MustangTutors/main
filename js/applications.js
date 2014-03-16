$(document).ready(function() {
    // Approve an application. Adds an 'approved' stamp and changes the buttons 
    // to be an Edit Profile button.
    $(document).on('click', '.approve', function() {
        var button = $(this);
        var status = button.parents('.applicationReview').find('img.applicationStatus');
        status.attr('src', 'img/approved.png');
        status.css('visibility', 'visible');
        var buttonContainer = button.parent();
        buttonContainer.html('<a href="#" class="edit button">View/Edit Profile</a>');
        var profileURL = 'tutor.html?user_id=' + jQuery.data(buttonContainer.parents('.applicationReview')[0], 'user_id');
        buttonContainer.find('a').attr('href', profileURL);
    });

    // Deny an application. Adds a 'denied' stamp and hides the buttons.
    $(document).on('click', '.deny', function() {
        var button = $(this);
        var status = button.parents('.applicationReview').find('img.applicationStatus');
        status.attr('src', 'img/denied.png');
        status.css('visibility', 'visible');
        button.parent().css('visibility', 'hidden');
    });

    // Parse JSON for Applications
    $.ajax({
        url: "json/applications.json",
        success: function(json) {
            //json = JSON.parse(json);
            json = json.Applications;
            // Define list of days
            var days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday");
            for(var i = 0; i < json.length; i++) {
                // Create and append new node
                var application = $('<article class="applicationReview meeting">' + 
                                        '<div class="tutorNamePending">' + 
                                            '<img class="applicationStatus" alt="Application Status">' + 
                                            '<h2 class="tutorName left"></h2>' + 
                                        '</div>' + 
                                        '<div class="tutorPictureTranscript">' + 
                                            '<div class="tutorPicture">' + 
                                                '<img src="" alt="Tutor Headshot">' + 
                                            '</div>' + 
                                            '<a href="#" class="viewTranscript button">View Transcript</a>' + 
                                        '</div>' + 
                                        '<div class="reviewCourses summary">' + 
                                            '<h3 class="subheading">Courses</h3>' + 
                                            '<ul></ul>' + 
                                        '</div>' + 
                                        '<div class="reviewHours summary">' + 
                                            '<h3 class="subheading">Regular Hours</h3>' + 
                                            '<ol></ol>' + 
                                        '</div>' + 
                                        '<div class="reviewButtons">' + 
                                            '<button class="deny button">Deny</button>' + 
                                            '<button class="approve button">Approve</button>' + 
                                        '</div>' + 
                                        '<div class="clearBoth"></div>' + 
                                    '</article>');
                $('#applications').append(application);

                // Add information from JSON
                // Link to transcript
                application.find('a').attr('href', 'transcripts/' + json[i].User_ID + '.pdf');
                // Tutor picture
                application.find('.tutorPicture img').attr('src', 'img/tutors/' + json[i].User_ID + '.jpg');
                // Tutor name
                application.find('.tutorName').html(json[i].First_Name + " " + json[i].Last_Name);
                // Courses
                var courses = json[i].Courses;
                for (var j = 0; j < courses.length; j++) {
                    var course = $('<li><span class="listLabel"></span><span class="listContent"></span></li>');
                    course.find('.listLabel').html(courses[j].Subject + " " + courses[j].Course_Number + ":");
                    course.find('.listContent').html(courses[j].Course_Name);
                    application.find('.reviewCourses ul').append(course);
                }
                // Regular Hours
                var hours = json[i].Hours;
                for (var j = 0, k = 0; j < days.length; j++) {
                    var day = $('<li><span class="listLabel"></span><span class="listContent"></span></li>');
                    day.find('.listLabel').html(days[j]);
                    if ((k < hours.length) && (hours[k].Day === days[j])) {
                        day.find('.listContent').html(convertTime(hours[k].Start_Time) + " to " + convertTime(hours[k].End_Time));
                        k++;
                    }
                    else {
                        day.find('.listContent').html("N/A");
                    }
                    application.find('.reviewHours ol').append(day);
                }
                // Store User ID in the application.
                jQuery.data(application[0], 'user_id', json[i].User_ID);
            }
        }
    });
});