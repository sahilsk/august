var TwitterClient = require('./twitter_cred');
var config = require("config");
var Sentiment = require('./sentiments_analysis');
var PractoBot = require("./bots/practo");
var TweetModel = require("./model/tweet")

var replyToTweet = function( reply, cb){
	var payload = {status: reply.text, in_reply_to_status_id: reply.to };
	console.log( payload);
	TwitterClient.post('statuses/update', payload,  cb);
}

module.exports = function(io){


	io.on('connection', function(socket){
	  console.log('a user connected this time as well');
	  socket.on('reply', function(msg){
	  	console.log("reply to sent: ", msg);
	  	//replyToTweet({ text: doc_list[1], to: tweet.id}, function(error, tweet, response){
		replyToTweet({ text:  '@' + msg.tweet.user.screen_name +  ' ' + msg.replyMessage , to: msg.tweet.id_str}, function(error, tweet, response){
			console.log(error);
			//if(error) throw error;
			console.log(tweet);  // Tweet body. '
			var message = msg.tweet.id + " tweet replied";
			if(error){
				message = error.message;
			}
			io.emit("notify", { type: "replied", tweet: msg.tweet, message: message } );
		});
	  });
	  socket.on('resolve', function(msg){
	  	console.log("tweet resolve request received");

	  	TweetModel.find({ "id" : msg.tweet.id}, function(err, result){
	  		console.log("finding tweet with id: ", msg.tweet.id);
	  		console.log("result->", result);
	  	});
		TweetModel.update({ "id" : msg.tweet.id}, 
							{ "resolve": true}, 
							{multi: false},
							function(err, row, reply){
								console.log(err);
								console.log("num row updated: ", row);
								console.log("mongo response: ", reply);
								io.emit("notify", { type: "resolved", tweet: msg.tweet, message: msg.tweet.id + " tweet resolved"} );
							});
	  });

	  socket.on('error', function (err) { console.error(err.stack); })

	});
	io.on('disconnect', function(socket){
	  console.log('a user disconnected');
	});


	TwitterClient.stream('statuses/filter', {track: 'cracto,modi,augustcracto,' + config.botName }, function(stream) {
	  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx AuguestBot is listening for tweets");
	  stream.on('data', function(tweet) {

	    //check if command for bot
	    if( tweet.text.toLowerCase().indexOf( config.botName.toLowerCase() ) !== -1){
	    	PractoBot( tweet, function(err, done){
	    		console.log("PractoBot Replied!!");
	    	});
	    }
	  	//ignore tweet if not direct tweet
	  	console.log( tweet.in_reply_to_status_id, tweet.user.screen_name);
	  	if( tweet.in_reply_to_status_id  && config.masters.indexOf(tweet.user.screen_name) !== -1 ){
	  		console.log("ignore bot replies");
	  		return;
	  	}
	    console.log("tweet", tweet);
	    //Calculate sentiment score
	    tweet.sentiment_score = Sentiment(tweet.text).score; // {score: xxx}


	    //save tweet in db
	    var t_model = new TweetModel( tweet);
	    t_model.save( function(err, reply){
	    	if(err){
	    		console.log("error saving tweet", err);
	    	}else{
	    		console.log("Tweet saved: ", reply)
	    	}
	    	//finally emit tweet
	    	io.emit("tweet", tweet);
	    })

	  });
	  stream.on('error', function(error) {
	  	console.log("Error in stream ", error);
	    //throw error;
	  });
	});

}
