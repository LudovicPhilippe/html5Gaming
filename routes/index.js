var  async = require('async'),
    mongoose = require('mongoose'),
    Score = require('../models/score').score;

module.exports.fetchSTopScore = function(req, res){
    //fetch top 10 score player's

    Score.find({ 'score': score}, function (err, results) {
        if (!results){
            console.log("oups");
        }
        return res.end(JSON.stringify({topScores : results,success : true}));
    })
};

module.exports.fetchSClosestScore = function(req, res){
    //fetch player's score and closest others player's score
    var score = req.body.score;

    Score.findOne({ 'score': score}, function (err, results) {
        if (!results){
            console.log("oups");
        }
        return res.end(JSON.stringify({closestScores : results,success : true}));
    })
};

module.exports.setScore = function(req, res){
    var user = req.body.pseudo,
        score = req.body.score;

    var scoreT = new Score({
        userName : user,
        score : score});

    scoreT.save(function(err) {
        if(err){
            console.log(err);
            return res.end(JSON.stringify({error : 0, errorMessage: "Server error: " + err, success : false}));
        }
        console.log("success");
        return res.end(JSON.stringify({error: null, errorMessage: null, success: true}));
    });
};

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
