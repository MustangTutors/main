$(document).ready(function() {
    $(document).on('click', '.approve', function() {
        $(this).parent().html('<button class="edit button">Edit Profile</button>');
    });
});