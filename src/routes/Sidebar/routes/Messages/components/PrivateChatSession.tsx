'use strict';
import React from 'react';

import ChatLayout, { ChatActions } from 'routes/Sidebar/components/chat/ChatLayout';
import MessageFooter from 'routes/Sidebar/routes/Messages/components/MessageFooter';

import PrivateChatMessageStore from 'stores/PrivateChatMessageStore';

import AccessConstants from 'constants/AccessConstants';
import { SessionActions } from 'decorators/ActiveSessionDecorator';


interface PrivateChatSessionProps {
  session: API.PrivateChat;
  actions: ChatActions & SessionActions;
}

class PrivateChatSession extends React.Component<PrivateChatSessionProps> {
  static displayName = 'PrivateChatSession';

  render() {
    const { session, actions } = this.props;
    return (
      <div className="private chat session">
        <ChatLayout
          chatAccess={ AccessConstants.PRIVATE_CHAT_SEND }
          messageStore={ PrivateChatMessageStore }
          actions={ actions }
          session={ session }
        />

        <MessageFooter
          session={ session }
        />
      </div>
    );
  }
}

export default PrivateChatSession;
