var 
	React = require('react/addons'),
	TweetApp = require('../components/app')
;


var initialState = JSON.parse(document.getElementById('initialState').innerHTML);
React.render(
  <TweetApp tweets={initialState} />,
  document.getElementById('reactPlaceHolder')
);