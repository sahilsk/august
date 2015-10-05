var
	React = require('react/addons')
;
var Notifier = React.createClass({

	render: function(){
		return (
			<div className={ this.props.alert ? "notify active" : "notify" } >
				{ this.props.alertMsg.message }
			</div>
		)
	}
});

module.exports = Notifier;