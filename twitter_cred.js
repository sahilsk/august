var Twitter = require('twitter');
var config = require("config");

var client = new Twitter({
  consumer_key: config.twitter.api_key,
  consumer_secret: config.twitter.api_secret,
  access_token_key: config.twitter.access_token,
  access_token_secret: config.twitter.access_token_secret
});

module.exports = client;