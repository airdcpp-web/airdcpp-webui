'use strict';
import React from 'react';

import PrivateChatActions from 'actions/PrivateChatActions';
import { CCPMEnum } from 'constants/PrivateChatConstants';

import { SessionFooter } from 'routes/Sidebar/components/SessionFooter';
import Loader from 'components/semantic/Loader';
import { ActionMenu } from 'components/menu/DropdownMenu';
import EncryptionState from 'components/EncryptionState';


const getCaption = (state) => {
	switch (state) {
		case CCPMEnum.CONNECTED: return 'Direct encrypted channel established';
		case CCPMEnum.CONNECTING: return <Loader size="mini" inline={ true } text="Establishing connection..."/>;
		case CCPMEnum.DISCONNECTED: return 'Direct encrypted channel available';
		default: return null;
	}
};

const CCPMState = ({ contextGetter, item }) => {
	if (!item.ccpm_state.supported) {
		return null;
	}
	
	const state = item.ccpm_state.id;
	const ids = [ state === CCPMEnum.CONNECTED ? 'disconnectCCPM' : 'connectCCPM' ];

	return (
		<SessionFooter>
			<div className="ccpm-state">
				<EncryptionState encryption={ item.ccpm_state.encryption } alwaysVisible={ true }/>
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