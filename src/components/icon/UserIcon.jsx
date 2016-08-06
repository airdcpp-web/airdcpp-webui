import React from 'react';
import classNames from 'classnames';

import TypeConvert from 'utils/TypeConvert';


const getUserIcon = (flags) => {
	if (flags.indexOf('ignored') > -1) {
		return 'red ban icon';
	}

	return TypeConvert.userOnlineStatusToColor(flags) + ' user icon';
};

const getCornerIcon = (flags) => {
	if (flags.indexOf('bot') > -1) {
		return 'setting';
	}

	if (flags.indexOf('op') > -1) {
		return 'yellow privacy';
	}

	if (flags.indexOf('me') > -1) {
		return 'blue star';
	}

	if (flags.indexOf('noconnect') > -1) {
		return 'red plug';
	}

	if (flags.indexOf('passive') > -1) {
		return 'orange protect';
	}

	return null;
};

const UserIcon = ({ flags, size, className }) => {
	const cornerIconClass = getCornerIcon(flags);
	return (
		<i className={ classNames(className, size, 'icons') }>
			<i className={ getUserIcon(flags) }/>
			{ cornerIconClass ? <i className={ cornerIconClass + ' corner icon' }/> : null }
		</i>
	);
};

UserIcon.propTypes = {
	/**
	 * Size of the icon
	 */
	size: React.PropTypes.string,

	/**
	 * User flag array
	 */
	flags: React.PropTypes.array.isRequired,

	className: React.PropTypes.string,
};

export default UserIcon;