import React from 'react';

import LayoutHeader from 'components/semantic/LayoutHeader';

const NewLayout = React.createClass({
	propTypes: {
		/**
		 * Title of the button
		 */
		title: React.PropTypes.any.isRequired,

		/**
		 * Title of the button
		 */
		subheader: React.PropTypes.any,
	},

	render: function () {
		return (
			<div className="new-layout">
				<LayoutHeader
					className="new"
					title={ this.props.title }
					icon={ this.props.icon }
					subheader={ this.props.subheader }
				/>
				{this.props.children}
			</div>
		);
	}
});

export default NewLayout
;