'use strict';
import React from 'react';

import ChatLayout, { ChatActions } from 'routes/Sidebar/components/chat/ChatLayout';
import MessageFooter from 'routes/Sidebar/routes/Messages/components/MessageFooter';

import PrivateChatMessageStore from 'stores/PrivateChatMessageStore';

import * as API from 'types/api';
//import * as UI from 'types/ui';
import { SessionChildProps } from 'routes/Sidebar/components/SessionLayout';


interface PrivateChatSessionProps extends SessionChildProps<API.PrivateChat, ChatActions> {
  //session: API.PrivateChat;
  //actions: UI.SessionActions<API.PrivateChat, ChatActions>;
}

class PrivateChatSession extends React.Component<PrivateChatSessionProps> {
  static displayName = 'PrivateChatSession';

  render() {
    const { session, actions } = this.props;
    return (
      <div className="private chat session">
        <ChatLayout
          chatAccess={ API.AccessEnum.PRIVATE_CHAT_SEND }
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
