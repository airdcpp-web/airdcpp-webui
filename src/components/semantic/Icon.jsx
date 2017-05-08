import PropTypes from 'prop-types';
import React from 'react';

import classNames from 'classnames';


const Icon = ({ icon, size, className, cornerIcon }) => {
	if (typeof icon !== 'string') {
		return icon ? icon : null;
	}

	if (cornerIcon) {
		return (
			<i className={ classNames(size, className, 'icon icons') }>
				<i className={ classNames(icon, 'icon') }/>
				<i className={ classNames(cornerIcon, 'corner icon') }/>
			</i>
		);
	}

	return (
		<i className={ classNames(size, icon, className, 'icon') }/>
	);
};

Icon.propTypes = {
	/**
	 * Icon class
	 */
	icon: PropTypes.node,

	cornerIcon: PropTypes.string,

	className: PropTypes.string,

	size: PropTypes.string,
};

export default Icon;
