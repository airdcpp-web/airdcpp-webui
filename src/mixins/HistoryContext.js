import React from 'react';

const HistoryContext = {
	propTypes: {
		route: React.PropTypes.object.isRequired
	},

	childContextTypes: {
		history: React.PropTypes.object.isRequired
	},

	getChildContext() {
		return {
			history: this.props.history
		};
	},
};

export default HistoryContext;