import React from 'react';

import classNames from 'classnames';


const Icon = ({ icon, size }) => {
	if (typeof icon !== 'string') {
		return icon ? icon : null;
	}

	return (
		<i 
			className={ icon + ' icon' }
		/>
	);
};

Icon.propTypes = {
	/**
	 * Icon class
	 */
	//icon: React.PropTypes.string,
};

export default Icon;