// getting-started.js
var mongoose = require('mongoose');
var config  = require("config");


mongoose.connect('mongodb://' + config.mongo.host + ':' 
					+ config.mongo.port + '/' + config.mongo.database);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));
db.once('open', function (callback) {
  console.log("connected to database...");
});

module.exports = mongoose;