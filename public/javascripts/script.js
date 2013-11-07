$(document).ready(function() {

    ////////////////////////////////
    //          SET_SCORE         //
    ////////////////////////////////
    var successTfCbk = function(data){
        $('#publish').hide();
        $('#publish_response').text("Score sent !");
    };

    var failureTfCbk = function(data){
        $('#publish_response').text("Error");
    };

    $('#publish').submit(function(e) {
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

    ////////////////////////////////
    //         FETCH_SCORE        //
    ////////////////////////////////



    var successFetchClosestScoreCbk = function(data){
        console.log(data);
        for(i in data.prevScore){
            $('#closestScore').append('<p>' + " Player : "  + data.prevScore[i].userName + "score : " + data.prevScore[i].score + '</p>');
            $('#closestScore').append('</br>');
        }
        $('#closestScore').text($('#score').val());
        for(i in data.nextScore){
            $('#closestScore').text('<p>' +" Player : "  + data.nextScore[i].userName + "score : " + data.nextScore[i].score + '</p>');
            $('#closestScore').append('</br>');
        }
    };

    var failureFetchClosestScoreCbk = function(data){
        $('#closestScore').text("Error");
    };

    $('#closestScore').click(function(e) {
        var score = $('#score').val();
        fetchClosestScore(score, successFetchClosestScoreCbk, failureFetchClosestScoreCbk);
        e.preventDefault();
    });


    function fetchClosestScore(score, onSuccess, onFailure) {
        $.post("/fetchSClosestScore", {score : score}, function(data) {
            if (data.error) {
                return onFailure(data);
            } else {
                return onSuccess(data);
            }
        }, 'json');
    }
});
