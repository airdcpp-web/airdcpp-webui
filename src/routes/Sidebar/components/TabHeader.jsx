import React from 'react';

const TabHeader = React.createClass({
	propTypes: {
		/**
		 * Header title
		 */
		title: React.PropTypes.node.isRequired,

		/**
		 * Subheader
		 */
		subHeader: React.PropTypes.node,

		/**
		 * Icon to display
		 */
		icon: React.PropTypes.node.isRequired,

		/**
		 * Icon to display
		 */
		buttonClickHandler: React.PropTypes.func.isRequired,
	},

	getDefaultProps() {
		return {
			buttonCaption: 'Close'
		};
	},

	render() {
		return (
			<div className="tab-header">
				<h2 className="ui header main-header">
					{ this.props.icon }
					<div className="content">
						{ this.props.title }
						<div className="sub header">{ this.props.subHeader }</div>
					</div>
				</h2>
				<div className="ui button" onClick={this.props.buttonClickHandler}>
					{this.props.buttonCaption}
				</div>
			</div>
		);
	},
});

export default TabHeader
;