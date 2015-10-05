var 
	React = require('react/addons'),
  Tweet = require("./tweet")
;

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Tweets = React.createClass({
  render: function(){
  	var tweet = this.props.tweet;
    var tweets_arr = [];
      this.props.tweets.forEach( function(tweet){
        tweets_arr.push( <Tweet tweet={tweet} key={ `tweet${tweet.id}`} />)
      })
    return (
      <div className="tweets">
        
      <ReactCSSTransitionGroup transitionName="example">
      {tweets_arr}
      </ReactCSSTransitionGroup>
	
      </div>
    );
  }
});
module.exports = Tweets;
