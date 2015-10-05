var 
	mongoose = require("./connect")

;

var TweetSchema = mongoose.Schema({
    name: String,
    text : String,
    created_at: Date,
    id: Number,
    sentiment_score: Number,
    resolve: Boolean,
    user: {
            name: String, 
    		screen_name: String, 
    		id_str: String, 
    		profile_image_url: String,
    		followers_count: Number,
    		friends_count: Number,
    		statuses_count: Number,
    		created_at: Date,
    		lang: String,
    		location: String,
    		coordinates: { type: String, coordinates: [Number] }, // (longitude first, then latitude).
    		place: String,

    	 }
});

var Tweet = mongoose.model('Tweet', TweetSchema);

module.exports = Tweet;