'use strict';
import React from 'react';

import ChatLayout, { ChatAPI, ChatActionList } from 'routes/Sidebar/components/chat/ChatLayout';
import MessageFooter from 'routes/Sidebar/routes/Messages/components/MessageFooter';

import PrivateChatMessageStore from 'stores/PrivateChatMessageStore';

import * as API from 'types/api';
//import * as UI from 'types/ui';

import { SessionChildProps } from 'routes/Sidebar/components/SessionLayout';
import { shareTempFile } from 'services/api/ShareApi';
import PrivateChatActions from 'actions/reflux/PrivateChatActions';


interface PrivateChatSessionProps extends SessionChildProps<API.PrivateChat, {}, ChatActionList> {

}

class PrivateChatSession extends React.Component<PrivateChatSessionProps> {
  static displayName = 'PrivateChatSession';

  handleFileUpload = (file: File) => {
    const { cid, hub_url, flags } = this.props.session.user;

    const isPrivate = flags.indexOf('nmdc') === -1 && flags.indexOf('bot') === -1;
    return shareTempFile(file, hub_url, isPrivate ? cid : undefined);
  }

  render() {
    const { session, sessionApi, sessionT, uiActions } = this.props;
    return (
      <div className="private chat session">
        <ChatLayout
          chatAccess={ API.AccessEnum.PRIVATE_CHAT_SEND }
          chatActions={ uiActions }
          chatApi={ PrivateChatActions as ChatAPI }
          sessionApi={ sessionApi }
          messageStore={ PrivateChatMessageStore }
          session={ session }
          handleFileUpload={ this.handleFileUpload }
        />

        <MessageFooter
          session={ session }
          sessionT={ sessionT }
        />
      </div>
    );
  }
}

export default PrivateChatSession;
