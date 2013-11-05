
// Inclusion de Mongoose
var mongoose = require('mongoose');

// connexion
mongoose.connect('mongodb://localhost/html5Gaming', function(err) {
    if (err) { throw err; }
});
