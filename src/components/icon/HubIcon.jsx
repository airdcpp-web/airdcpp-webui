import React from 'react';
import classNames from 'classnames';

import TypeConvert from 'utils/TypeConvert';


const HubIcon = ({ hub, size }) => (
	<i className={ classNames(size, 'icons') }>
		<i className={ TypeConvert.hubOnlineStatusToColor(hub.connect_state.id) + ' sitemap icon' }/>
	</i>
);

HubIcon.propTypes = {
	/**
	 * Size of the icon
	 */
	size: React.PropTypes.string,

	/**
	 * Hub object
	 */
	hub: React.PropTypes.object.isRequired,
};

export default HubIcon;