import React from 'react';
import History from 'utils/History';

import IconConstants from 'constants/IconConstants';
import { RouterMenuItemLink } from 'components/semantic/MenuItem';


const onClick = (evt, url, routerLocation) => {
	evt.preventDefault();

	History.pushSidebar(routerLocation, url);
};

const SessionNewButton = ({ url, title, className = '' }, { routerLocation }) => (
	<RouterMenuItemLink 
		key="button-new" 
		className={ 'new ' + className }
		icon={ IconConstants.CREATE }
		url={ url } 
		onClick={ evt => onClick(evt, url, routerLocation) }
	>
		{ title }
	</RouterMenuItemLink>
);

SessionNewButton.propTypes = {
	/**
	 * Base URL of the section
	 */
	url: React.PropTypes.string.isRequired,

	/**
	 * Title of the button
	 */
	title: React.PropTypes.node.isRequired,
};

SessionNewButton.contextTypes = {
	routerLocation: React.PropTypes.object.isRequired,
};

export default SessionNewButton;