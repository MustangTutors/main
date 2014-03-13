$(document).ready(function() {
    $("header").load("header.html");
    $("footer").load("footer.html");

    setToggleColor();

    // Change font color on toggle switch
    $(document).on('change', 'label.toggle input[type="checkbox"]', function(){
        var which = $(this).prop('checked');

        if(which){
            $(this).siblings('span').children('span.false').css('color', '#AAA');
            $(this).siblings('span').children('span.true').css('color', 'white');
        }
        else {
            $(this).siblings('span').children('span.false').css('color', 'white');
            $(this).siblings('span').children('span.true').css('color', '#AAA');
        }
    });
});

// Set the color of the toggles when the page loads
function setToggleColor() {
    var hist_view = $('label#historyView input[type="checkbox"]').prop('checked');

    if(hist_view){
        $('label#history_view span.true').css('color','white');
        $('label#history_view span.false').css('color','#AAA');
    }
    else{
        $('label#history_view span.true').css('color','#AAA');
        $('label#history_view span.false').css('color','white');
    }

    // This part doesn't work. I don't know why.
    var tutor_in = $('#toggleButton label input[type="checkbox"]').prop('checked');

    if(tutor_in){
        
        $('#toggleButton label span.true').css('color','white');
        $('#toggleButton label span.false').css('color','#AAA');
    }
    else{
        $('#toggleButton label span.true').css('color','#AAA');
        $('#toggleButton label span.false').css('color','white');
    }
}