'use strict';
import React from 'react';

import ChatLayout from 'routes/Sidebar/components/chat/ChatLayout';
import MessageFooter from './MessageFooter';

import PrivateChatMessageStore from 'stores/PrivateChatMessageStore';

import AccessConstants from 'constants/AccessConstants';


class PrivateChatSession extends React.Component {
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
