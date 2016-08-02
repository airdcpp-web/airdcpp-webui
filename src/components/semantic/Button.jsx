import React from 'react';

import classNames from 'classnames';

const Button = ({ className, loading, icon, caption, loadingCaption, disabled, ...other }) => {
	const buttonStyle = classNames(
		'ui button',
		{ 'disabled': disabled || loading },
		{ 'loading': loading },
		className,
	);

	return (
		<div className={ buttonStyle } { ...other }>
			{ icon ? <i className={ icon + ' icon' }/> : null }
			{ caption }
		</div>
	);
};

Button.propTypes = {
	/**
	 * Icon class
	 */
	icon: React.PropTypes.string,

	/**
	 * Button caption
	 */
	caption: React.PropTypes.node.isRequired,

	/**
	 * Disable button (the button will be disabled automatically when 'loading' is true)
	 */
	disabled: React.PropTypes.bool,

	/**
	 * Show spinner
	 */
	loading: React.PropTypes.bool,
};

export default Button;