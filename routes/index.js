var express = require('express');
var router = express.Router();
var React = require('react/addons');
var AugustApp = require("../components/app");
var TweetModel = require("../model/tweet")

/* GET home page. 
- get recent 10 tweets from mongodb
- 
*/

router.get('/', function(req, res, next) {
  var tweets = []; // require("../test/tweets.json"); //TODO: replace by mongodb calls

  TweetModel.find().sort( { created_at: -1 } ).limit(10).exec( function(err, tweets){
		if(err) {
			console.log("Error fetching tweets from mongodb");
		}else{
		  	tweets = tweets;
		  //	console.log(tweets);
		 }

	  var serverSideRenderedTweets = React.renderToString( React.createElement( AugustApp, {"tweets": tweets } )	  );  
	  res.render('index', { 
  						title: 'Express' , 
  						content: serverSideRenderedTweets,
  						initialData: JSON.stringify(tweets)
  						 });

  });

});

router.get('/page/:page/:skip', function(req, res){

		var page = req.params.page || 0;
		var skip = req.params.skip || 0;
		var per_page = 10;
  		var offset = (page * per_page) + (skip * 1);

  		var tweets = [];
		console.log("fetching records", page, skip);

  		TweetModel.find().sort( { created_at: -1 } ).skip(offset).limit(per_page).exec( function(err, tweets){
		if(err) {
			console.log("Error fetching tweets from mongodb");
		}else{
		  	tweets = tweets;
		 }
	  	res.json(tweets);

  });


});

module.exports = router;
