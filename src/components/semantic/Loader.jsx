import React from 'react';

// Disables the component of there are no online hubs
const Loader = React.createClass({
	propTypes: {
		text: React.PropTypes.node,
	},

	getDefaultProps() {
		return {
			text: 'Loading'
		};
	},

	render() {
		return (
			<div className="ui active text loader">
				{ this.props.text }
			</div>
		);
	},
});

export default Loader
;