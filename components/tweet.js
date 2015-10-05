var 
	React = require('react/addons')
  ,moment = require('moment')
;

var Tweet = React.createClass({

  sentimentToSmiley: function(score) {
    if(score === 0) { return { smiley: '/images/minions/despicable-me-2-Minion-icon-4.png', emotion: "neutral" }  }
    if(score < 0) {
      if(score > -2) { return { smiley: '/images/minions/Angry-Minion-icon.png' , emotion: "sad" } }
      return { smiley: '/images/minions/evil-minion-icon.png', emotion: "angry" }
    }

    if(score < 2) { return { smiley: '/images/minions/despicable-me-2-Minion-icon-3.png', emotion: "good" }  }
    return  { smiley: '/images/minions/despicable-me-2-Minion-icon-7.png', emotion: "happy" }
  },

  toggleReplyControls : function(event){
    console.log(this.props.tweet);
    event.target.nextSibling.style.display="block" ;
    console.log(event.target.nextSibling);
  },
  actionCancelReply: function(event){
    event.preventDefault();
    console.log("cancel reply");
    event.target.parentNode.style.display='none';
  },
  actionReplyToTweet: function(event){
    event.preventDefault();
    var self = this;
    self.event = event;
    console.log( event.target.previousSibling );
    var tweetMessage = event.target.previousSibling.value;
    console.log(  tweetMessage );

    if( tweetMessage.length > 0){
      socket.emit("reply", {tweet: this.props.tweet, replyMessage: tweetMessage} );
      event.target.parentNode.style.display="none";
     
    }
    console.log("replied");
  },
  toggleResolveTweet: function(event){
    event.preventDefault();
    console.log("resolving tweet");
    socket.emit("resolve", {tweet: this.props.tweet} );
    console.log("re-rendering...");
    this.forceUpdate();
  },  
  render: function(){
    var self = this;
  	var tweet = this.props.tweet;
    tweet.id = tweet.id;
    tweet.profile = "http://twitter.com/" + tweet.user.screen_name;
    var tweetSentiment = this.sentimentToSmiley(tweet.sentiment_score || 0);
    //if tweet is resolved set sentiment to neutral
    if( tweet.resolve ){
      tweetSentiment = { smiley: '/images/minions/despicable-me-2-Minion-icon-4.png', emotion: "neutral" };
    }
    var sentDivStyle = {
      backgroundImage: 'url(' + tweetSentiment.smiley + ')',
      backgroundSize: "90%",
      backgroundRepeat: "no-repeat",
      width: "60px",
      height: "60px"
    };

    var wrapperClass = "tweet_wrapper " + tweetSentiment.emotion;
    var resolveButtonClass = "fa fa-check fa-1x ";
    if( tweet.resolve === true){
      resolveButtonClass += " hidden";
    }
    return (
      <div className={wrapperClass} tweet_id={tweet.id}  id={tweet.id}>
       	<div className="posted_by" >
       		<img src={tweet.user.profile_image_url} style={{ height:"60px"}} />
       	</div>
        <div className="tweet_text">
          <span className="tweet_user"><a href={tweet.profile} >{tweet.user.name}  </a> </span>
         	<span className="tweet_user"> <a href={tweet.profile} >@{tweet.user.screen_name}  </a> </span>
          <span className="posted_at"> ~{ moment( tweet.created_at ).fromNow() } </span>
          <p>{ tweet.text} </p>
        </div>
        <div className="tweet_controls">
        
            <span className={resolveButtonClass} onClick={this.toggleResolveTweet} ></span>

          <span className="fa fa-reply fa-1x" onClick={this.toggleReplyControls} ></span>
          <div className='hidden' >
            <span className="fa fa-spinner hidden"> </span>
            <input type='text' className='tweetReplyText' />
            <input type='button' value='reply' className="fa fa-reply fa-1x" onClick={this.actionReplyToTweet}/>
            <input type='button' value='cancel'  onClick={this.actionCancelReply}/>

          </div>
        </div>
        <div className="sentiment" style={ sentDivStyle } >
        </div>
      </div>
    );
  }
});
module.exports = Tweet;