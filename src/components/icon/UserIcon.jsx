import React from 'react';

import Icon from 'components/semantic/Icon';
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

	if (flags.indexOf('self') > -1) {
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

const UserIcon = ({ flags, size, className }) => (
	<Icon
		className={ className }
		size={ size }
		icon={ getUserIcon(flags) }
		cornerIcon={ getCornerIcon(flags) }
	/>
);

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