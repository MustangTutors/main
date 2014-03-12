$(document).ready(function() {
    $(".tutorBox").on("mouseenter", function() {
        $(this).children(".tutorBox-extended").stop().slideDown();
    });
    $(".tutorBox").on("mouseleave", function() {
        $(this).children(".tutorBox-extended").stop().slideUp();
    });
});