
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
    for(var i in data.prevScore){
        $('#closestScore').append(data.prevScore[i].userName + "  : " + data.prevScore[i].score);
        $('#closestScore').append('</br>');
    }
    $('#closestScore').append("Vous etes ici ! : " +$('#score').val());
    $('#closestScore').append('</br>');
    for(var i in data.nextScore){
        $('#closestScore').append(data.nextScore[i].userName + "  : " + data.nextScore[i].score);
        $('#closestScore').append('</br>');
    }
};

var failureFetchClosestScoreCbk = function(data){
    $('#closestScore').text("Error");
};

function fetchClosestScore(score, onSuccess, onFailure) {
    $.post("/fetchSClosestScore", {score : score}, function(data) {
        if (data.error) {
            return onFailure(data);
        } else {
            return onSuccess(data);
        }
    }, 'json');
}

////////////////////////////////
//         FETCH_LEADS        //
////////////////////////////////



var successFetchLeadersScoreCbk = function(data){
    console.log(data);
    for(var i in data.topScores){
        $('#leader').append(data.topScores[i].userName + "  : " + data.topScores[i].score);
        $('#leader').append('</br>');
    }
};

var failureFetchClosestScoreCbk = function(data){
    $('#leader').text("Error");
};


function fetchSTopScore(onSuccess, onFailure) {
    $.post("/fetchSTopScore",  function(data) {
        if (data.error) {
            return onFailure(data);
        } else {
            return onSuccess(data);
        }
    }, 'json');
}


