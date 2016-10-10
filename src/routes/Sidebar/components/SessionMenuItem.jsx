import React from 'react';

import { RouterMenuItemLink } from 'components/semantic/MenuItem';


const onClickItem = (evt, sessionItem, pushSession) => {
	evt.preventDefault();

	pushSession(sessionItem);
};

const SessionMenuItem = ({ sessionItem, status, name, unreadInfoStore, url, pushSession }) => (
	<RouterMenuItemLink 
		url={ url } 
		className="session-item" 
		onClick={ evt => onClickItem(evt, sessionItem, pushSession) }
		icon={ status }
		session={ sessionItem }
		unreadInfoStore={ unreadInfoStore }
	>
		<span className="session-name">
			{ name }
		</span>
	</RouterMenuItemLink>
);

SessionMenuItem.propTypes = {
	/**
	 * Item URL
	 */
	url: React.PropTypes.string.isRequired,

	name: React.PropTypes.node.isRequired,

	unreadInfoStore: React.PropTypes.object.isRequired,

	status: React.PropTypes.node.isRequired,

	sessionItem: React.PropTypes.object.isRequired,

	pushSession: React.PropTypes.func.isRequired,
};

export default SessionMenuItem;