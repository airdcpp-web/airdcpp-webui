'use strict';
import React from 'react';

import PrivateChatActions from 'actions/PrivateChatActions';

import { SessionFooter } from 'routes/Sidebar/components/SessionFooter';
import Loader from 'components/semantic/Loader';
import { ActionMenu } from 'components/menu';
import EncryptionState from 'components/EncryptionState';

import * as API from 'types/api';


const getCaption = (state: API.CCPMStateEnum) => {
  switch (state) {
  case API.CCPMStateEnum.CONNECTED: return 'Direct encrypted channel established';
  case API.CCPMStateEnum.CONNECTING: return <Loader size="mini" inline={ true } text="Establishing connection..."/>;
  case API.CCPMStateEnum.DISCONNECTED: return 'Direct encrypted channel available';
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
  const actionIds = [ state === API.CCPMStateEnum.CONNECTED ? 'disconnectCCPM' : 'connectCCPM' ];

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