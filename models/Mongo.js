'use strict';

function Mongo() {
    this.mongoose = require('mongoose');
}

Mongo.prototype.initialize = function(options) {
    this.options = options || {};
    this.host = this.options.host || 'localhost';
    this.port = this.options.port || 27017;
    this.database = this.options.database || 'html5Gaming';

    delete this.options.host;
    delete this.options.port;
    delete this.options.database;

    if (!this.options.hasOwnProperty('w')) {
        this.options.w = 1;
    }
    if (!this.options.hasOwnProperty('wtimeout')) {
        this.options.wtimeout = 0;
    }

    if (!this.options.hasOwnProperty('auto_reconnect')) {
        /* jshint -W106 */
        this.options.auto_reconnect = true;
        /* jshint +W106 */
    }

    if (!this.options.hasOwnProperty('native_parser')) {
        /* jshint -W106 */
        this.options.native_parser = true;
        /* jshint +W106 */
    }
};

Mongo.prototype.connect = function(done) {
    this.mongoose.connect(this.host, this.database, this.port, this.options, done);
};

module.exports = new Mongo();
