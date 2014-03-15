$(document).ready(function() {
    // Approve an application. Adds an 'approved' stamp and changes the buttons 
    // to be an Edit Profile button.
    $(document).on('click', '.approve', function() {
        var button = $(this);
        var status = button.parents('.applicationReview').find('img.applicationStatus');
        status.attr('src', 'img/approved.png');
        status.css('visibility', 'visible');
        button.parent().html('<button class="edit button">Edit Profile</button>');
    });

    // Deny an application. Adds a 'denied' stamp and hides the buttons.
    $(document).on('click', '.deny', function() {
        var button = $(this);
        var status = button.parents('.applicationReview').find('img.applicationStatus');
        status.attr('src', 'img/denied.png');
        status.css('visibility', 'visible');
        button.parent().css('visibility', 'hidden');
    });
});