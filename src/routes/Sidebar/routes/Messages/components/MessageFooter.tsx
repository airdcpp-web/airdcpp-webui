import * as React from 'react';

import { SessionFooter } from '@/routes/Sidebar/components/SessionFooter';
import Loader from '@/components/semantic/Loader';
import { ActionMenu } from '@/components/action-menu';
import EncryptionState from '@/components/EncryptionState';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { PrivateChatCCPMActionMenu } from '@/actions/ui/private-chat/PrivateChatCCPMActions';

const getCaption = (state: API.CCPMStateEnum, sessionT: UI.ModuleTranslator) => {
  const { translate } = sessionT;
  switch (state) {
    case API.CCPMStateEnum.CONNECTED:
      return translate('Direct encrypted channel established');
    case API.CCPMStateEnum.CONNECTING:
      return (
        <Loader
          size="mini"
          inline={true}
          text={translate('Establishing connection...')}
        />
      );
    case API.CCPMStateEnum.DISCONNECTED:
      return translate('Direct encrypted channel available');
    default:
      return null;
  }
};

interface CCPMStateProps {
  privateChat: API.PrivateChat;
  sessionT: UI.ModuleTranslator;
}

const CCPMState: React.FC<CCPMStateProps> = ({ privateChat, sessionT }) => {
  const { flags } = privateChat.user;
  if (!flags.includes('ccpm')) {
    return null;
  }

  const state = privateChat.ccpm_state.id;
  if (state === API.CCPMStateEnum.DISCONNECTED && flags.includes('offline')) {
    return null;
  }

  return (
    <SessionFooter>
      <div className="ccpm-state">
        <EncryptionState
          encryption={privateChat.ccpm_state.encryption}
          alwaysVisible={true}
          boundary=".session-container"
        />
        <ActionMenu
          caption={getCaption(state, sessionT)}
          actions={PrivateChatCCPMActionMenu}
          itemData={privateChat}
        />
      </div>
    </SessionFooter>
  );
};

export default CCPMState;
