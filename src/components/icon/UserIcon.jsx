import PropTypes from 'prop-types';
import React from 'react';

import Icon from 'components/semantic/Icon';
import TypeConvert from 'utils/TypeConvert';


const getUserIcon = (flags) => {
	if (flags.indexOf('ignored') > -1) {
		return 'red ban';
	}

	return TypeConvert.userOnlineStatusToColor(flags) + ' user';
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

const UserIcon = ({ flags, ...other }) => (
	<Icon
		{ ...other }
		icon={ getUserIcon(flags) }
		cornerIcon={ getCornerIcon(flags) }
	/>
);

UserIcon.propTypes = {
	/**
	 * User flag array
	 */
	flags: PropTypes.array.isRequired,
};

export default UserIcon;