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
	icon: React.PropTypes.node,

	cornerIcon: React.PropTypes.string,

	className: React.PropTypes.string,

	size: React.PropTypes.string,
};

export default Icon;
