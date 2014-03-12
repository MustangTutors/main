$(document).ready(function() {
    // $(".tutorBox").eq(0).children(".tutorBox-extended").show();
    
    $(".tutorBox-small").on("mouseenter", function() {
        $(this).siblings(".tutorBox-extended").stop().animate({width:'toggle'}, 200);
    });
    $(".tutorBox-small").on("mouseleave", function() {
        $(this).siblings(".tutorBox-extended").stop().animate({width:'toggle'}, 200);
    });
});