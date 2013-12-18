var forever = require('forever-monitor'),
    path = require('path');

var child = new (forever.Monitor)(path.join(__dirname, 'app.js'), {
        'silent': true,
        'pidFile': path.join(__dirname, '../pid'),
        'logFile': path.join(__dirname, '../logs/forever.log'),
        'outFile': path.join(__dirname, '../logs/out.log'),
        'errFile': path.join(__dirname, '../logs/err.log')
});

child.start();
