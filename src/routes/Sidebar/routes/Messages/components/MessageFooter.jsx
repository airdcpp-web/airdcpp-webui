'use strict';
import React from 'react';

import PrivateChatActions from 'actions/PrivateChatActions';
import { CCPMEnum } from 'constants/PrivateChatConstants';

import { SessionFooter } from 'routes/Sidebar/components/SessionFooter';
import Loader from 'components/semantic/Loader';
import { ActionMenu } from 'components/menu/DropdownMenu';


const getCaption = (state) => {
	switch (state) {
		case CCPMEnum.CONNECTED: return 'Messages are sent through direct encrypted channel';
		case CCPMEnum.CONNECTING: return <Loader size="mini" inline={ true } text="Establishing connection..."/>;
		case CCPMEnum.DISCONNECTED: return 'Direct encrypted channel available';
	}
};

const getIcon = (state) => {
	switch (state) {
		case CCPMEnum.CONNECTED: return 'yellow lock icon';
		case CCPMEnum.CONNECTING: return null;
		case CCPMEnum.DISCONNECTED: return 'lock icon';
	}
};

const CCPMState = ({ contextGetter, item }) => {
	if (!item.ccpm_state.supported) {
		return <span/>;
	}
	
	const state = item.ccpm_state.id;
	const ids = [ state === CCPMEnum.CONNECTED ? 'disconnectCCPM' : 'connectCCPM' ];

	return (
		<SessionFooter>
			<div className="ccpm-state">
				<i className={ getIcon(state) }/>
				<ActionMenu
					caption={ getCaption(state) }
					actions={ PrivateChatActions }
					ids={ ids }
					contextGetter={ contextGetter }
					itemData={ item }
				/>
			</div>
		</SessionFooter>
	);
};

export default CCPMState;