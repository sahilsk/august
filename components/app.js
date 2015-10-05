var 
	React = require('react/addons'),
  Tweets = require('./tweets'),
  Loader = require('./loader'),
	Notifer = require('./notifier'),
  io  = require('socket.io-client'),
  http = require('http')
;

global.socket  = {}
var socket =  global.socket;

var App = React.createClass({
  getInitialState: function(props){
    var props = props  || this.props;
    return {
      tweets: props.tweets ,
      unreadTweets : { tweets : [], count: 0 },
      done: false ,
      page: 0,
      skip: 0,
      loading: false,
      alert: false,
      alertMsg: {}
    };
  },
  componentDidMount: function() {
    var self = this;
   	console.log("componentDidMount called");
    
    global.socket = io('http://localhost:3000');
    socket = global.socket;
    socket.on("tweet", function(tweet){
      console.log(tweet);
      var tweets = self.state.tweets;
      tweets.unshift( tweet);
      self.setState({tweets: tweets} );
     });

    socket.on("notify", function(msg){
      console.log("notify:", msg);
      switch(msg.type){
        case "resolved":
          console.log( msg.message);
          self.setState({alertMsg: msg, alert: true});
          setTimeout(function(){
             self.setState({alert: false, alertMsg: {} });
          }, 3000);
          break;
        case "replied":
          console.log( msg.message);
          self.setState({alertMsg: msg, alert: true});
          setTimeout(function(){
             self.setState({alert: false, alertMsg: {} });
          }, 3000);
          break;
        default:
          console.log("unknown notification");
      }

    })

    window.addEventListener("scroll", self.checkScroll );
  },
   getTweets : function(){
      var self = this;
      var currentPage = self.state.page;
      var opts = {
        path: '/page/' + (currentPage+1) + "/" + self.state.skip
      };  
      
      var newTweets = [];
      http.get( opts, function(res){
        res.on('data', function (result) {
              newTweets = JSON.parse(result);
              if( newTweets.length === 0){
                self.setState({done: true});
              }
          });

          res.on('end', function () {
             var oldTweets = JSON.parse(JSON.stringify(self.state.tweets)); 
             var updatedTweets =  oldTweets.concat( newTweets) ;
             setTimeout( function(){
              self.setState( { tweets :updatedTweets, page: currentPage+1, loading: false })  
             }, 1E3);

             
          });
    
      })

    }, 
  checkScroll : function(ev){
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      var s = Math.max( document.body.scrollTop || document.documentElement.scrollTop );
      var scrolled = (h + s) > document.body.offsetHeight;

      if( scrolled && !this.state.done ){
        this.setState({loading: true});
        this.getTweets();
      }

  },  

  render: function(){
    return (
      <div > 
        <Tweets tweets={this.state.tweets}/> 
        <Loader loading={this.state.loading} /> 
        <Notifer alert={this.state.alert} alertMsg={this.state.alertMsg} /> 
      </div>
    );
  }
});
module.exports = App;