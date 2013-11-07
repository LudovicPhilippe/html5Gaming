'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var scoreSchema = new Schema({
    score : Number,
    userName : String
});


module.exports = {
    'scoreSchema': scoreSchema,
    'score': mongoose.model('score', scoreSchema)
};
