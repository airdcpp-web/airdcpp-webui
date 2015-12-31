'use strict';
import React from 'react';

import PrivateChatActions from 'actions/PrivateChatActions';

import { CCPMEnum } from 'constants/PrivateChatConstants';
import Loader from 'components/semantic/Loader';
import { ActionMenu } from 'components/menu/DropdownMenu';


const CCPMState = ({ state, contextGetter, item }) => {
	if (state === CCPMEnum.CONNECTING) {
		return <Loader size="mini" inline={ true } text="Establishing connection..."/>;
	}

	const connected = state === CCPMEnum.CONNECTED;
	return (
		<div className="ccpm-state">
			<i className={ (connected ? 'yellow' : '') + ' lock icon' }/>
			<ActionMenu
				caption={ connected ? 'Messages are sent through direct encrypted channel' : 'Direct encryption channel available' }
				actions={ PrivateChatActions }
				ids={ [ connected ? 'disconnectCCPM' : 'connectCCPM' ] }
				contextGetter={ contextGetter }
				itemData={ item }
			/>
		</div>
	);
};

export default CCPMState;