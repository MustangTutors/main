$(document).ready(function() {
    $(".tutorBox-small").on("mouseenter", function() {
        $(this).siblings(".tutorBox-extended").stop().animate({width:'toggle'}, 250);
    });
    $(".tutorBox-small").on("mouseleave", function() {
        $(this).siblings(".tutorBox-extended").stop().animate({width:'toggle'}, 250);

    });
});