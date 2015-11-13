import React from 'react';

import classNames from 'classnames';

const Button = React.createClass({
	propTypes: {

		/**
		 * Icon class
		 */
		icon: React.PropTypes.string,

		/**
		 * Button caption
		 */
		caption: React.PropTypes.node.isRequired,

		/**
		 * Caption to show when 'loading' is true
		 */
		//loadingCaption: React.PropTypes.node,

		/**
		 * Disable button (the button will be disabled automatically when 'loading' is true)
		 */
		disabled: React.PropTypes.bool,

		/**
		 * Show spinner
		 */
		loading: React.PropTypes.bool,
	},

	render: function () {
		const { className, loading, icon, caption, loadingCaption, disabled, ...other } = this.props;
		const buttonStyle = classNames(
			'ui button',
			{ 'disabled': disabled || loading },
			{ 'loading': loading },
			className
		);

		return (
			<div className={ buttonStyle } { ...other }>
				{ icon ? <i className={ icon + ' icon' }></i> : null }
				{ caption }
			</div>
		);
	},
});

export default Button;