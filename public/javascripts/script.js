$(document).ready(function() {
    var successTfCbk = function(data){
        $('#publish').hide();
        $('#publish_response').text("Score sent !");
    };

    var failureTfCbk = function(data){
        $('#publish_response').text("Error");
    };

    $('#publish').submit(function(e) {
        alert($('#score').val());
        var pseudo = $('#addname').val(),
            score = $('#score').val();
        setScore(pseudo, score, successTfCbk, failureTfCbk);
        e.preventDefault();
    });


    function setScore(pseudo, score, onSuccess, onFailure) {
        $.post("/setScore", {pseudo : pseudo , score : score}, function(data) {
            if (data.error) {
                return onFailure(data);
            } else {
                return onSuccess(data);
            }
        }, 'json');
    }
});
