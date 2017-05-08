import PropTypes from 'prop-types';
import React from 'react';

import classNames from 'classnames';
import Icon from 'components/semantic/Icon';

import 'semantic-ui/components/button.min.css';


const Button = ({ className, loading, icon, caption, loadingCaption, disabled, ...other }) => {
	const buttonStyle = classNames(
		'ui button',
		{ 'disabled': disabled || loading },
		{ 'loading': loading },
		className,
	);

	return (
		<div className={ buttonStyle } { ...other }>
			<Icon icon={ icon }/>
			{ caption }
		</div>
	);
};

Button.propTypes = {
	/**
	 * Icon class
	 */
	icon: PropTypes.string,

	/**
	 * Button caption
	 */
	caption: PropTypes.node.isRequired,

	/**
	 * Disable button (the button will be disabled automatically when 'loading' is true)
	 */
	disabled: PropTypes.bool,

	/**
	 * Show spinner
	 */
	loading: PropTypes.bool,
};

export default Button;
