import React from 'react';
import createReactClass from 'create-react-class';
//@ts-ignore
import Reflux from 'reflux';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';
import UserItemHandlerDecorator from 'routes/Sidebar/decorators/UserItemHandlerDecorator';

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import PrivateChatActions from 'actions/PrivateChatActions';

import MessageNew from 'routes/Sidebar/routes/Messages/components/MessageNew';
import PrivateChatSession from 'routes/Sidebar/routes/Messages/components/PrivateChatSession';

import * as API from 'types/api';
import * as UI from 'types/ui';

import '../style.css';


const sessionActions = [ 'clear' ];

const Messages = createReactClass<UI.SessionRouteProps, {}>({
  displayName: 'Messages',
  mixins: [ Reflux.connect(PrivateChatSessionStore, 'chatSessions') ],

  render() {
    const { match, ...other }: UI.SessionRouteProps = this.props;
    return (
      <SessionLayout 
        activeId={ match.params.id }
        baseUrl="messages"
        items={ this.state.chatSessions }
        newCaption="New session"
        newDescription="Open a new private chat session"
        newIcon="comments"
        unreadInfoStore={ PrivateChatSessionStore }
        editAccess={ API.AccessEnum.PRIVATE_CHAT_EDIT }
        actions={ PrivateChatActions }
        actionIds={ sessionActions }
        sessionItemLayout={ PrivateChatSession }
        newLayout={ MessageNew }

        { ...UserItemHandlerDecorator([ 'browse', 'ignore', 'unignore' ]) }
        { ...other }
      />
    );
  },
});

export default Messages;
