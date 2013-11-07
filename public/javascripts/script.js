
////////////////////////////////
//          SET_SCORE         //
////////////////////////////////
var successTfCbk = function(data){
    $('#publish0').hide();
    $('#submitResponse').show();
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
        $('#closestScore1').append('<span class="name">'+ data.prevScore[i].userName +'</span>'+ '<span class="score">'+ data.prevScore[i].score +'</span>' + '</br>');
    }
    $('#YouAreHere').append('<span class="name">'+ "You score " +'</span>'+ '<span class="score">'+ $('#score').val() +'</span>'+ '</br>');
    for(var i in data.nextScore){
        $('#closestScore2').append('<span class="name">'+ data.nextScore[i].userName +'</span>'+ '<span class="score">'+ data.nextScore[i].score +'</span>'+ '</br>');
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
    var beurk = 1;
    for(var i in data.topScores){
        $('#leader').append('<span class="rank">'+ "#" + beurk +'</span>'+ '<span class="name">'+ data.topScores[i].userName +'</span>' + '<span class="score">'+ data.topScores[i].score +'</span>' +'</br>' );
        beurk++;
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


