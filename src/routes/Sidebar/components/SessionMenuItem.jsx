import React from 'react';

import { Link } from 'react-router';
import History from 'utils/History';

import CountLabel from 'components/CountLabel';


const onClickItem = (evt, routerLocation, url) => {
	evt.preventDefault();

	History.pushSidebar(routerLocation, url);
};

const SessionMenuItem = ({ sessionItem, status, name, unreadInfoStore, url }, { routerLocation }) => (
	<Link 
		to={ url } 
		className="item session-item" 
		onClick={ evt => onClickItem(evt, routerLocation, url) } 
		activeClassName="active"
	>
		<div className="left-content">
			{ status }
			<span className="session-name">
				{ name }
			</span>
		</div>

		{ unreadInfoStore ? <CountLabel urgencies={ unreadInfoStore.getItemUrgencies(sessionItem) }/> : null }
	</Link>
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