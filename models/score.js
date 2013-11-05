var mongoose = require('mongoose');

// Création du schéma pour l'inscription
var scoreSchema = new mongoose.Schema({
    score : String,
    userName : String
});

// Création du Model pour l'inscription
var scoreModel= mongoose.model('score', scoreSchema);

module.exports =  scoreModel;
