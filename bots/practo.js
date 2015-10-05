var 
	PractoClient = require("../practo_cred")
,  TwitterClient = require('../twitter_cred')
,  fs = require("fs")
;
/*

bot: find doctors with speciality:{XYZ} near { me | city | locality }
eg;
	- august@practo find doctors with speciality dentist near me   //Require GPS on
	- august@practo find doctors with speciality dentist in city bangalore who work in locality whitefield
	- august@practo find doctors with speciality dentist near city bangalore who work in locality whitefield
*/

var minionList = fs.readdirSync('./public/images/minions') ;

var sanitize = function(tweet){
	//replace double spaces
	tweet.text = tweet.text.replace("  ", " ");
}

var replyToTweet = function( reply, cb){
	var payload = {status: reply.text, in_reply_to_status_id: reply.to };
	console.log( payload);
	TwitterClient.post('statuses/update', payload,  cb);
}

var postMinionToTweet = function( reply, cb){

	var minion = minionList[Math.floor(Math.random()*minionList.length)];
	var image = fs.readFileSync( __dirname + '/../public/images/minions/' + minion, {encoding: 'base64'});

	TwitterClient.post('media/upload', {media_data: image}, function(err, data, res) {
		if (err) console.log(err);
			console.log(data);
		TwitterClient.post('statuses/update', {status: "It's a POC silly. Don't be greedy", 
								media_ids: data.media_id_string, 
								in_reply_to_status_id: reply.to}, function(err, params, res) {
		if (err) console.log(err);
			console.log(params);
		});
	});
}

var shortenResult = function(doctors){
	var result = [];
	for(var i =0; i < doctors.length; i++){
		result.push( { 
					'doctor_name': doctors[i]['doctor_name'], 
					'doctor_profile_url': doctors[i]['doctor_profile_url'],
					'consultation_fees': doctors[i]['consultation_fees']
					});
	}
	return result;
} 

module.exports = function(tweet, callback){
	var searchOption = {};
	//sanitize tweet
	sanitize(tweet);

	//tokenize
	var tokenize = tweet.text.split(" ");

	console.log( tokenize);

	//searchFor specialization | doctor | practice
	if( tweet.text.toLowerCase().indexOf("doctor" )  !== -1){
		searchOption['searchfor'] = "doctor";
	}else if ( tweet.text.toLowerCase().indexOf("practice" )  !== -1){
		searchOption['searchfor'] = "practice";
	}else{
		searchOption['searchfor'] = "specialization";
	}

	//find doctors by speciality
	if( tweet.text.toLowerCase().indexOf("speciality" )  !== -1){
		searchOption['speciality'] = tokenize[ tokenize.indexOf('speciality') +1 ]
	}

	//find doctors by city: default
	if( tweet.text.toLowerCase().indexOf("city" )  !== -1){
		searchOption['city'] = tokenize[ tokenize.indexOf('city') +1 ]
	}else if( tweet.text.toLowerCase().indexOf("in" )  !== -1){
		searchOption['city'] = tokenize[ tokenize.indexOf('in') +1 ]
	}

	//find doctors by locality
	if( tweet.text.toLowerCase().indexOf("locality" )  !== -1){
		searchOption['locality'] = tokenize[ tokenize.indexOf('locality') +1 ]
	}

	// find doctors near me: [long, lat]
	if( tweet.text.toLowerCase().indexOf("near me" )  !== -1){
		if( tweet.coordinates){
			var coordinate = tweet.coordinates['coordinates'];
			searchOption['near'] = coordinate[1] + ',' + coordinate[0];	
			searchOption['city'] =  searchOption['city'] || "bangalore";
		}
	}

	//searchOption['city'] =  searchOption['city'] || "bangalore";
	console.log("search option: ", searchOption);

	var textToReply = '';
	//fire the searcher
	PractoClient.search( searchOption, function(err, reply){
		if( !err && reply.statusCode === 200){
			var doc_list = shortenResult( reply.body['doctors'] );
			console.log("result", doc_list );
			if( doc_list.length > 0 ){
				for( var i =0; i < 2; i++){
					textToReply += doc_list[i]['doctor_name'] + '-> ' + doc_list[i]['doctor_profile_url'] + ', ';
				}
			}
		}else{
			console.log("Failed to fetech result ", err)
			console.log("Failed to fetch. Reason: ", reply.body);
		}

		if( textToReply.length >= 5 ){
			//replyToTweet({ text: doc_list[1], to: tweet.id}, function(error, tweet, response){
			replyToTweet({ text:  '@' + tweet.user.screen_name +  ' ' + textToReply , to: tweet.id_str}, function(error, tweet, response){
				console.log(error);
				if(error) throw error;
				console.log(tweet);  // Tweet body. 
			});
		}else{
			postMinionToTweet({ text:  '@' + tweet.user.screen_name +  ' ' + textToReply , to: tweet.id_str}, function(error, tweet, response){
				console.log(error);
				if(error) throw error;
				console.log(tweet);  // Tweet body. 
			});
		}

		callback(err, doc_list);
	});


}

