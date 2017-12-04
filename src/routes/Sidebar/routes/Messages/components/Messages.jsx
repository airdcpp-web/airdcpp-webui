import React from 'react';
import createReactClass from 'create-react-class';
import Reflux from 'reflux';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';
import UserItemHandlerDecorator from 'routes/Sidebar/decorators/UserItemHandlerDecorator';

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import PrivateChatActions from 'actions/PrivateChatActions';

import AccessConstants from 'constants/AccessConstants';

import '../style.css';


const sessionActions = [ 'clear' ];

const Messages = createReactClass({
  displayName: 'Messages',
  mixins: [ Reflux.connect(PrivateChatSessionStore, 'chatSessions') ],

  render() {
    const { match, children, ...other } = this.props;
    return (
      <SessionLayout 
        activeId={ match.params.id }
        baseUrl="messages"
        items={ this.state.chatSessions }
        newCaption="New session"
        newDescription="Open a new private chat session"
        newIcon="comments"
        unreadInfoStore={ PrivateChatSessionStore }
        editAccess={ AccessConstants.PRIVATE_CHAT_EDIT }
        actions={ PrivateChatActions }
        actionIds={ sessionActions }

        { ...UserItemHandlerDecorator([ 'browse', 'ignore', 'unignore' ]) }
        { ...other }
      >
        { children }
      </SessionLayout>
    );
  },
});

export default Messages;
