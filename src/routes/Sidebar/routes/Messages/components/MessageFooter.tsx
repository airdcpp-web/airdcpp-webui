'use strict';
import React from 'react';

import PrivateChatActions from 'actions/PrivateChatActions';
import { CCPMEnum } from 'constants/PrivateChatConstants';

import { SessionFooter } from 'routes/Sidebar/components/SessionFooter';
import Loader from 'components/semantic/Loader';
import { ActionMenu } from 'components/menu/DropdownMenu';
import EncryptionState from 'components/EncryptionState';


const getCaption = (state: API.CCPMStateId) => {
  switch (state) {
  case CCPMEnum.CONNECTED: return 'Direct encrypted channel established';
  case CCPMEnum.CONNECTING: return <Loader size="mini" inline={ true } text="Establishing connection..."/>;
  case CCPMEnum.DISCONNECTED: return 'Direct encrypted channel available';
  default: return null;
  }
};


interface CCPMStateProps {
  session: API.PrivateChat;
}

const CCPMState: React.SFC<CCPMStateProps> = ({ session }) => {
  if (session.user.flags.indexOf('ccpm') === -1) {
    return null;
  }

  const state = session.ccpm_state.id;
  const actionIds = [ state === CCPMEnum.CONNECTED ? 'disconnectCCPM' : 'connectCCPM' ];

  return (
    <SessionFooter>
      <div className="ccpm-state">
        <EncryptionState 
          encryption={ session.ccpm_state.encryption } 
          alwaysVisible={ true }
          boundary="#sidebar"
        />
        <ActionMenu
          caption={ getCaption(state) }
          actions={ PrivateChatActions }
          ids={ actionIds }
          itemData={ session }
        />
      </div>
    </SessionFooter>
  );
};

export default CCPMState;