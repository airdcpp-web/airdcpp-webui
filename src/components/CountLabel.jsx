import React from 'react';

const CountLabel = React.createClass({
	propTypes: {
		/**
		 * Count and color for the label in format [count, "color"]
		 */
		unreadInfo: React.PropTypes.object,
	},
	
	getDefaultProps() {
		return {
			className: ""
		}
	},

	render() {
		const { unreadInfo } = this.props;
		if (!unreadInfo) {
			return null;
		}

		return (<div className={ "ui label " + this.props.className + " " + unreadInfo.color}> { unreadInfo.count } </div>)
	},
});

export default CountLabel;