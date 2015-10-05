var Sentiment = require("sentiment")

module.exports = function(text){
	return Sentiment(text);
}