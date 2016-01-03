'use strict';
import React from 'react';

import PrivateChatActions from 'actions/PrivateChatActions';
import { CCPMEnum } from 'constants/PrivateChatConstants';

import { SessionFooter } from 'routes/Sidebar/components/SessionFooter';
import Loader from 'components/semantic/Loader';
import { ActionMenu } from 'components/menu/DropdownMenu';


const CCPMState = ({ contextGetter, item }) => {
	if (!item.ccpm_state.supported) {
		return <span/>;
	}
	
	const state = item.ccpm_state.id;

	if (state === CCPMEnum.CONNECTING) {
		return <Loader size="mini" inline={ true } text="Establishing connection..."/>;
	}

	const connected = state === CCPMEnum.CONNECTED;
	const iconClass = (connected ? 'yellow' : '') + ' lock icon';
	const caption = connected ? 'Messages are sent through direct encrypted channel' : 'Direct encryption channel available';
	const ids = [ connected ? 'disconnectCCPM' : 'connectCCPM' ];

	return (
		<SessionFooter>
			<div className="ccpm-state">
				<i className={ iconClass }/>
				<ActionMenu
					caption={ caption }
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