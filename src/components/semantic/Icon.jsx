/* @flow */

import React from 'react';

import classNames from 'classnames';


const Icon = ({ icon, size, className }) => {
	if (typeof icon !== 'string') {
		return icon ? icon : null;
	}

	return (
		<i
			className={ classNames(icon, className, 'icon') }
		/>
	);
};

Icon.propTypes = {
	/**
	 * Icon class
	 */
	icon: React.PropTypes.node,

	className: React.PropTypes.string,
};

export default Icon;
