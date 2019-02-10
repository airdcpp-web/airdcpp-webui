import React from 'react';

import UserSearchInput from 'components/autosuggest/UserSearchInput';
import RecentLayout from 'routes/Sidebar/components/RecentLayout';

import PrivateChatActions from 'actions/PrivateChatActions';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';

import { HistoryEntryEnum } from 'constants/HistoryConstants';
import { Location } from 'history';

import * as API from 'types/api';


interface MessageNewProps {
  location: Location;
}

class MessageNew extends React.Component<MessageNewProps> {
  handleSubmit = (nick: string | null, user: API.HintedUser) => {
    PrivateChatActions.actions.createSession(this.props.location, user, PrivateChatSessionStore);
  }

  recentUserRender = (entry: API.HistoryItem) => {
    return (
      <a onClick={ _ => this.handleSubmit(null, entry.user!) }>
        { entry.user!.nicks }
      </a> 
    );
  }

  hasSession = (entry: API.HistoryItem) => {
    return PrivateChatSessionStore.getSession(entry.user!.cid);
  }

  render() {
    return (
      <div className="session new"> 
        <UserSearchInput 
          submitHandler={ this.handleSubmit } 
          offlineMessage="You must to be connected to at least one hub in order to send private messages"
        />
        <RecentLayout
          entryType={ HistoryEntryEnum.PRIVATE_CHAT }
          hasSession={ this.hasSession }
          entryTitleRenderer={ this.recentUserRender }
          entryIcon="comments"
        />
      </div>
    );
  }
}

export default MessageNew;
