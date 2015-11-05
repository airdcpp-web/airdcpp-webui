import React from 'react';

const ErrorMessage = React.createClass({
	propTypes: {
		/**
		 * Message title
		 */
		title: React.PropTypes.node,

		/**
		 * Error details
		 */
		description: React.PropTypes.node,
	},

	render: function () {
		return (
			<div className="ui negative message">
				<div className="header">
					{ this.props.title }
				</div>
				<p>{this.props.description}</p>
			</div>
		);
	}
});

export default ErrorMessage
;