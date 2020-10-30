'use strict';
import * as React from 'react';

import PrivateChatActions from 'actions/ui/PrivateChatActions';

import { SessionFooter } from 'routes/Sidebar/components/SessionFooter';
import Loader from 'components/semantic/Loader';
import { ActionMenu } from 'components/menu';
import EncryptionState from 'components/EncryptionState';

import * as API from 'types/api';
import * as UI from 'types/ui';


const getCaption = (state: API.CCPMStateEnum, sessionT: UI.ModuleTranslator) => {
  const { translate } = sessionT;
  switch (state) {
  case API.CCPMStateEnum.CONNECTED: return translate('Direct encrypted channel established');
  case API.CCPMStateEnum.CONNECTING: return (
    <Loader 
      size="mini" 
      inline={ true } 
      text={ translate('Establishing connection...') }
    />
  );
  case API.CCPMStateEnum.DISCONNECTED: return translate('Direct encrypted channel available');
  default: return null;
  }
};


interface CCPMStateProps {
  session: API.PrivateChat;
  sessionT: UI.ModuleTranslator;
}

const CCPMState: React.FC<CCPMStateProps> = ({ session, sessionT }) => {
  const { flags } = session.user;
  if (flags.indexOf('ccpm') === -1) {
    return null;
  }

  const state = session.ccpm_state.id;
  if (state === API.CCPMStateEnum.DISCONNECTED && flags.indexOf('offline') !== -1) {
    return null;
  }

  return (
    <SessionFooter>
      <div className="ccpm-state">
        <EncryptionState 
          encryption={ session.ccpm_state.encryption } 
          alwaysVisible={ true }
          boundary=".session-container"
        />
        <ActionMenu
          caption={ getCaption(state, sessionT) }
          actions={ PrivateChatActions }
          ids={[ 'disconnectCCPM', 'connectCCPM' ]}
          itemData={ session }
        />
      </div>
    </SessionFooter>
  );
};

export default CCPMState;