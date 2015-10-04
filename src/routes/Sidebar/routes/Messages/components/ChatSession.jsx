'use strict';

import React from 'react';

import { Link } from 'react-router';

import MessageView from 'routes/Sidebar/components/MessageView'


import PrivateChatSessionStore from 'stores/PrivateChatSessionStore'
import PrivateChatActions from 'actions/PrivateChatActions'

//import '../style.css'

const ChatSession = React.createClass({
  displayName: "ChatSession",
  //mixins: [Reflux.connect(PrivateChatSessionStore, "chatSessions")],

  render() {
    return (
      <MessageView>

      </MessageView>
    );
  },
});

export default ChatSession;