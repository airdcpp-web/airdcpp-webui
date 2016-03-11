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
		subHeader: React.PropTypes.any,
	},

	getDefaultProps() {
		return {
			className: '',
		};
	},

	render: function () {
		return (
			<div className={ 'new-layout ' + this.props.className }>
				<LayoutHeader
					className="new"
					title={ this.props.title }
					icon={ this.props.icon }
					subHeader={ this.props.subHeader }
				/>
				{this.props.children}
			</div>
		);
	}
});

export default NewLayout
;