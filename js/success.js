// Check if the user is logged in. If not, redirect to index.html
$.ajax({
    url: "Laravel/public/users/current",
    success: function(json) {
        json = JSON.parse(json);
        if (json.length === 0) {
            window.location.href = "index.html";
        }
    }
});