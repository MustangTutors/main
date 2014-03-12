$(document).ready(function() {
    // Temporary stuff.
    $(".tutorBox .ratingStars").eq(0).html(convertToStars(4.3));
    $(".tutorBox .ratingStars").eq(1).html(convertToStars(5));
    $(".tutorBox .ratingStars").eq(2).html(convertToStars(2.7));
    $(".tutorBox .ratingStars").eq(3).html(convertToStars(1));
    $(".tutorBox .ratingStars").eq(4).html(convertToStars(2.5));

    $(".tutorBox:nth-of-type(4n-3), .tutorBox:nth-of-type(4n-2)").find(".tutorBox-extended").addClass("extend-right");
    $(".tutorBox:nth-of-type(4n), .tutorBox:nth-of-type(4n-1)").find(".tutorBox-extended").addClass("extend-left");

    // When you hover in and out of a tutor's box, it shows/hides more info.
    $(".tutorBox-small").on("mouseenter", function() {
        $(this).siblings(".tutorBox-extended.extend-right").stop().animate({width:'toggle'}, 200);
        $(this).siblings(".tutorBox-extended.extend-left").stop().animate({left:-312, width:'toggle'}, 200);
    });
    $(".tutorBox-small").on("mouseleave", function() {
        $(this).siblings(".tutorBox-extended.extend-right").stop().animate({width:'toggle'}, 200);
        $(this).siblings(".tutorBox-extended.extend-left").stop().animate({left:0, width:'toggle'}, 200);
    });
});

// Generate stars for the rating, given a decimal number.
function convertToStars(num) {
    var output = "";

    // Round the number to the nearest 0.5
    num = (Math.round(num * 2) / 2).toFixed(1);

    // Add to the output the right number of stars
    for (num; num > 0.5; num--) {
        output += '<img src="img/star.png" alt="Rating Star">';
    }
    if (num !== 0) {
        output += '<img src="img/halfstar.png" alt="Rating Star">';
    }

    return output;
}