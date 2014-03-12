$(document).ready(function() {
    $(".tutorBox").on("mouseenter", function() {
        $(this).children(".tutorBox-extended").css("display", "block");
    });
    $(".tutorBox").on("mouseleave", function() {
        $(this).children(".tutorBox-extended").css("display", "none");
    });
});