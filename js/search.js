$(document).ready(function() {
    // Load tutors
    getTutors({});

    // Load course subjects
    $.ajax({
        url: "Laravel/public/courses/subjects",
        success: function(output) {
            json = JSON.parse(output);
            for (var i = 0; i < json.length; i++) {
                var subject = $(document.createElement('option'));
                subject.attr('value', json[i].subject);
                subject.html(json[i].subject);
                $('#search-subject').append(subject);
            }
        }
    });

    $(document).on('submit', '#searchTutorsForm', function(event) {
        event.preventDefault();

        // Put search form data into object
        var searchData = new Object();
        var fname = $("#search-tutorFirstName").val();
        var lname = $("#search-tutorLastName").val();
        var subject = $("#search-subject").val();
        var cnumber = $("#search-courseNumber").val();
        var cname = $("#search-courseName").val();
        var available = $("#search-available").is(':checked');
        if (fname !== "") {
            searchData.fname = fname;
        }
        if (lname !== "") {
            searchData.lname = lname;
        }
        if (subject !== null && subject !== "") {
            searchData.subject = subject;
        }
        if (cnumber !== "") {
            searchData.cnumber = cnumber;
        }
        if (cname !== "") {
            searchData.cname = cname;
        }
        if (available !== false) {
            searchData.available = "2";
        }

        getTutors(searchData);
    });
    
});

function expandInfo() {
    $(this).siblings(".tutorBox-extended.extend-right").stop().animate({width:'toggle'}, 200);
    $(this).siblings(".tutorBox-extended.extend-left").stop().animate({left:-312, width:'toggle'}, 200);
}

function contractInfo() {
    $(this).siblings(".tutorBox-extended.extend-right").stop().animate({width:'toggle'}, 200);
    $(this).siblings(".tutorBox-extended.extend-left").stop().animate({left:0, width:'toggle'}, 200);
}

function getTutors(searchData) {
    $.ajax({
        type: "GET",
        url: "Laravel/public/users/current",
        success: function(json) {
            if (json !== "[]") {
                json = JSON.parse(json);
                json = json[0];
                if (Number(json.admin) === 1) {
                    searchData.admin = "1";
                }
            }
            console.log(searchData);
            $.ajax({
                url: "Laravel/public/tutor/search",
                type: "GET",
                data: searchData,
                beforeSend: function() {
                    $("#tutorBoxes").html("");
                    $(".loading").show();
                },
                complete: function() {
                    $(".loading").hide();
                },
                success: function(json) {
                    json = JSON.parse(json);
                    if (json.length === 0) {
                        $("#tutorBoxes").html("<div class='error'>No tutors were found with those search criteria.</div>");
                    }
                    for(var i = 0; i < json.length; i++) {
                        // Create and append new node
                        var tutor = $('<article class="tutorBox">' + 
                                            '<a class="tutorProfileLink" href="#">' + 
                                                '<div class="tutorBox-small">' + 
                                                    '<div class="tutorPicture">' + 
                                                        '<img src="" alt="Tutor Headshot">' + 
                                                    '</div>' + 
                                                    '<div class="tutorNameAvailability">' + 
                                                        '<img src="" alt="Availability">' + 
                                                        '<span class="tutorName"></span>' + 
                                                    '</div>' + 
                                                '</div>' + 
                                                '<div class="tutorBox-extended">' + 
                                                    '<span class=""></span>' + 
                                                    '<div class="tutorNameRating">' + 
                                                        '<span class="tutorName"></span>' + 
                                                        '<div class="rating">' + 
                                                            '<span>Average of <span class="numRatings"></span>: </span>' + 
                                                            '<div class="ratingStars"></div>' + 
                                                        '</div>' + 
                                                    '</div>' + 
                                                '</div>' + 
                                            '</a>' + 
                                        '</article>');
                        $('#tutorBoxes').append(tutor);

                        // Add information from JSON

                        // Link to tutor profile
                        tutor.find('a').attr('href', 'tutor.html?user_id=' + json[i].User_ID);

                        // Tutor picture
                        tutor.find('.tutorPicture img').attr('src', 'img/tutors/' + json[i].User_ID + '.jpg');

                        // Tutor name
                        tutor.find('.tutorName').html(json[i].First_Name + " " + json[i].Last_Name);

                        // Darken background if tutor is inactive (for admin search)
                        if (Number(json[i].Active) === 0) {
                            tutor.addClass("inactive");
                            tutor.find('.tutorNameAvailability img').attr('src', 'img/unavailable.png');
                            tutor.find('.tutorBox-extended > span').addClass('disabled');
                            tutor.find('.tutorBox-extended > span').html('Disabled');
                        }
                        else {
                            // Tutor availability
                            switch(Number(json[i].Available)) {
                                case 2:
                                    // available
                                    tutor.find('.tutorNameAvailability img').attr('src', 'img/available.png');
                                    tutor.find('.tutorBox-extended > span').addClass('available');
                                    tutor.find('.tutorBox-extended > span').html('Available');
                                    break;
                                case 1:
                                    // busy
                                    tutor.find('.tutorNameAvailability img').attr('src', 'img/busy.png');
                                    tutor.find('.tutorBox-extended > span').addClass('busy');
                                    tutor.find('.tutorBox-extended > span').html('Busy');
                                    break;
                                default:
                                    // unavailable
                                    tutor.find('.tutorNameAvailability img').attr('src', 'img/unavailable.png');
                                    tutor.find('.tutorBox-extended > span').addClass('unavailable');
                                    tutor.find('.tutorBox-extended > span').html('Unavailable');
                                    break;
                            }
                        }

                        // Number of ratings
                        if (Number(json[i].Number_Ratings) === 1) {
                            tutor.find('.numRatings').html(json[i].Number_Ratings + ' rating');
                        }
                        else {
                            tutor.find('.numRatings').html(json[i].Number_Ratings + ' ratings');
                        }

                        // Average rating (make stars)
                        var stars = convertToStars(json[i].Average_Rating);
                        tutor.find('.ratingStars').html(stars);

                    }

                    // Apply the extend-left class to the left half of tutors, apply the 
                    // extend-right class to the right half of tutors.
                    $(".tutorBox:nth-of-type(4n-3), .tutorBox:nth-of-type(4n-2)").find(".tutorBox-extended").addClass("extend-right");
                    $(".tutorBox:nth-of-type(4n), .tutorBox:nth-of-type(4n-1)").find(".tutorBox-extended").addClass("extend-left");
                
                    // When you hover in and out of a tutor's box, it shows/hides more info.
                    $('.tutorBox-small').hoverIntent(expandInfo, contractInfo);

                    // Replace broken tutor images
                    $('img').error(function(){
                        $(this).attr('src', 'img/tutor.png');
                    });
                }
            });
        }
    });
}