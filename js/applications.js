// Check if the user is logged in and an admin. If not, redirect to index.html
$.ajax({
    url: "Laravel/public/users/current",
    success: function(json) {
        json = JSON.parse(json);
        if (json.length === 0) {
            window.location.href = "index.html";
        }
        else if (json.length === 1 && Number(json[0].admin) !== 1) {
            window.location.href = "index.html";
        }
    }
});

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
        var userID = jQuery.data(buttonContainer.parents('.applicationReview')[0], 'user_id');
        var profileURL = 'tutor.html?user_id=' + userID;
        buttonContainer.find('a').attr('href', profileURL);
        $.ajax({
            url: "Laravel/public/admin/application/approved/" + userID,
            success: function() {
                updateNotificationCount();
            }
        });
    });

    // Deny an application. Adds a 'denied' stamp and hides the buttons.
    $(document).on('click', '.deny', function() {
        var button = $(this);
        var status = button.parents('.applicationReview').find('img.applicationStatus');
        status.attr('src', 'img/denied.png');
        status.css('visibility', 'visible');
        var buttonContainer = button.parent();
        buttonContainer.css('visibility', 'hidden');
        var userID = jQuery.data(buttonContainer.parents('.applicationReview')[0], 'user_id');
        $.ajax({
            url: "Laravel/public/admin/application/denied/" + userID,
            success: function() {
                updateNotificationCount();
            }
        });
    });

    // Parse JSON for Applications
    $.ajax({
        url: "Laravel/public/admin/applications",
        success: function(json) {
            json = JSON.parse(json);
            json = json.Applications;

            // Show message for no applications
            if (json.length === 0) {
                $('#applicationsMain .error').show();
            }

            // Define list of days
            var days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
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
                application.find('a').attr('href', 'transcripts/' + json[i].user_id + '.pdf');
                // Tutor picture
                application.find('.tutorPicture img').attr('src', 'img/tutors/' + json[i].user_id + '.jpg');
                // Tutor name
                application.find('.tutorName').html(json[i].First_Name + " " + json[i].Last_Name);
                // Courses
                var courses = json[i].Courses;
                for (var j = 0; j < courses.length; j++) {
                    var course = $('<li><span class="listLabel"></span><span class="listContent"></span></li>');
                    course.find('.listLabel').html(courses[j].subject + " " + courses[j].course_number + ":");
                    course.find('.listContent').html(courses[j].course_name);
                    application.find('.reviewCourses ul').append(course);
                }
                // Regular Hours
                var hours = json[i].Hours;
                for (var j = 0, k = 0; j < days.length; j++) {
                    var day = $('<li><span class="listLabel"></span><span class="listContent"></span></li>');
                    day.find('.listLabel').html(days[j]);
                    if ((k < hours.length) && (hours[k].day === (j+1))) {
                        day.find('.listContent').html(convertTime(hours[k].start_time) + " to " + convertTime(hours[k].end_time));
                        k++;
                    }
                    else {
                        day.find('.listContent').html("N/A");
                    }
                    application.find('.reviewHours ol').append(day);
                }
                // Store User ID in the application.
                jQuery.data(application[0], 'user_id', json[i].user_id);
            }
            
            // Replace broken tutor images
            $('img').error(function(){
                $(this).attr('src', 'img/tutors/tutor.png');
            });
        }
    });
});