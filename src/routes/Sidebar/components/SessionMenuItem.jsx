import React from 'react';

import { RouterMenuItemLink } from 'components/semantic/MenuItem';
import History from 'utils/History';


const onClickItem = (evt, routerLocation, url) => {
	evt.preventDefault();

	History.pushSidebar(routerLocation, url);
};

const SessionMenuItem = ({ sessionItem, status, name, unreadInfoStore, url }, { routerLocation }) => (
	<RouterMenuItemLink 
		url={ url } 
		className="session-item" 
		onClick={ evt => onClickItem(evt, routerLocation, url) }
		urgencies={ unreadInfoStore ? unreadInfoStore.getItemUrgencies(sessionItem) : null }
		icon={ status }
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
};

SessionMenuItem.contextTypes = {
	routerLocation: React.PropTypes.object.isRequired,
};

export default SessionMenuItem;