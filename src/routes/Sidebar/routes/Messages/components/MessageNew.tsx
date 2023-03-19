import { Component } from 'react';

import RecentLayout from 'routes/Sidebar/components/RecentLayout';

import PrivateChatActions from 'actions/reflux/PrivateChatActions';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';

import { HistoryEntryEnum } from 'constants/HistoryConstants';

import * as API from 'types/api';

import { NewSessionLayoutProps } from 'routes/Sidebar/components/SessionLayout';
import IconConstants from 'constants/IconConstants';
import { UserSelectField } from 'components/select';

const hasSession = (entry: API.HistoryItem) => {
  return PrivateChatSessionStore.getSession(entry.user!.cid);
};

class MessageNew extends Component<NewSessionLayoutProps> {
  handleSubmit = (user: API.HintedUser) => {
    PrivateChatActions.createSession(this.props.location, user, PrivateChatSessionStore);
  };

  recentUserRender = (entry: API.HistoryItem) => {
    return <a onClick={(_) => this.handleSubmit(entry.user!)}>{entry.user!.nicks}</a>;
  };

  render() {
    const { sessionT } = this.props;
    return (
      <div className="private chat session new">
        <UserSelectField
          onChange={this.handleSubmit}
          offlineMessage={sessionT.t<string>(
            'offlineMessage',
            'You must to be connected to at least one hub in order to send private messages'
          )}
          isClearable={false}
          autoFocus={true}
        />
        <RecentLayout
          entryType={HistoryEntryEnum.PRIVATE_CHAT}
          hasSession={hasSession}
          entryTitleRenderer={this.recentUserRender}
          entryIcon={IconConstants.MESSAGES_PLAIN}
        />
      </div>
    );
  }
}

export default MessageNew;
