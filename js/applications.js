$(document).ready(function() {
    $(document).on('click', '.approve', function() {
        var button = $(this);
        var status = button.parents('.applicationReview').find('img.applicationStatus');
        status.attr('src', 'img/approved.png');
        status.css('visibility', 'visible');
        button.parent().html('<button class="edit button">Edit Profile</button>');
    });
    $(document).on('click', '.deny', function() {
        var button = $(this);
        var status = button.parents('.applicationReview').find('img.applicationStatus');
        status.attr('src', 'img/denied.png');
        status.css('visibility', 'visible');
        button.parent().css('visibility', 'hidden');
    });
});