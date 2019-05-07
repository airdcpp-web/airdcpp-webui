import React from 'react';

import UserSearchInput from 'components/autosuggest/UserSearchInput';
import RecentLayout from 'routes/Sidebar/components/RecentLayout';

import PrivateChatActions from 'actions/reflux/PrivateChatActions';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';

import { HistoryEntryEnum } from 'constants/HistoryConstants';

import * as API from 'types/api';

import { NewSessionLayoutProps } from 'routes/Sidebar/components/SessionLayout';
import IconConstants from 'constants/IconConstants';


const hasSession = (entry: API.HistoryItem) => {
  return PrivateChatSessionStore.getSession(entry.user!.cid);
};

class MessageNew extends React.Component<NewSessionLayoutProps> {
  handleSubmit = (nick: string | null, user: API.HintedUser) => {
    PrivateChatActions.createSession(this.props.location, user, PrivateChatSessionStore);
  }

  recentUserRender = (entry: API.HistoryItem) => {
    return (
      <a onClick={ _ => this.handleSubmit(null, entry.user!) }>
        { entry.user!.nicks }
      </a> 
    );
  }

  render() {
    const { sessionT } = this.props;
    return (
      <div className="private chat session new"> 
        <UserSearchInput 
          submitHandler={ this.handleSubmit } 
          offlineMessage={ sessionT.t<string>(
            'offlineMessage',
            'You must to be connected to at least one hub in order to send private messages'
          ) }
        />
        <RecentLayout
          entryType={ HistoryEntryEnum.PRIVATE_CHAT }
          hasSession={ hasSession }
          entryTitleRenderer={ this.recentUserRender }
          entryIcon={ IconConstants.MESSAGES }
        />
      </div>
    );
  }
}

export default MessageNew;
