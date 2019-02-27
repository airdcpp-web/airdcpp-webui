'use strict';
import React from 'react';

import ChatLayout, { ChatActions, ChatLayoutProps, ChatAPI } from 'routes/Sidebar/components/chat/ChatLayout';
import MessageFooter from 'routes/Sidebar/routes/Messages/components/MessageFooter';

import PrivateChatMessageStore from 'stores/PrivateChatMessageStore';

import * as API from 'types/api';
//import * as UI from 'types/ui';

import { SessionChildProps } from 'routes/Sidebar/components/SessionLayout';
import PrivateChatActions from 'actions/reflux/PrivateChatActions';


interface PrivateChatSessionProps extends SessionChildProps<API.PrivateChat, ChatActions>, 
  Pick<ChatLayoutProps, 'chatActions'> {

}

class PrivateChatSession extends React.Component<PrivateChatSessionProps> {
  static displayName = 'PrivateChatSession';

  render() {
    const { session, chatActions, sessionApi, sessionT } = this.props;
    return (
      <div className="private chat session">
        <ChatLayout
          chatAccess={ API.AccessEnum.PRIVATE_CHAT_SEND }
          chatActions={ chatActions }
          chatApi={ PrivateChatActions as ChatAPI }
          sessionApi={ sessionApi }
          messageStore={ PrivateChatMessageStore }
          session={ session }
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
