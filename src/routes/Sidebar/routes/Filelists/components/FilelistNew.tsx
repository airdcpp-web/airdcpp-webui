import React from 'react';

import UserSearchInput from 'components/autosuggest/UserSearchInput';
import RecentLayout from 'routes/Sidebar/components/RecentLayout';

import FilelistSessionActions from 'actions/reflux/FilelistSessionActions';
import FilelistSessionStore from 'stores/FilelistSessionStore';

import ShareProfileSelector from 'routes/Sidebar/routes/Filelists/components/ShareProfileSelector';
import { HistoryEntryEnum } from 'constants/HistoryConstants';

import * as API from 'types/api';

import { NewSessionLayoutProps } from 'routes/Sidebar/components/SessionLayout';
import IconConstants from 'constants/IconConstants';


class FilelistNew extends React.Component<NewSessionLayoutProps> {
  handleSubmit = (nick: string | null, user: API.HintedUser) => {
    FilelistSessionActions.createSession(this.props.location, user, FilelistSessionStore);
  }

  onProfileChanged = (profileId: number) => {
    FilelistSessionActions.ownList(this.props.location, profileId, FilelistSessionStore);
  }

  recentUserRender = (entry: API.HistoryItem) => {
    return (
      <a onClick={ _ => this.handleSubmit(null, entry.user!) }>
        { entry.user!.nicks + (entry.description ? ` (${entry.description})` : '') }
      </a> 
    );
  }

  hasSession = (entry: API.HistoryItem) => {
    return FilelistSessionStore.getSession(entry.user!.cid);
  }

  render() {
    const { sessionT } = this.props;
    return (
      <div className="filelist session new">
        <UserSearchInput 
          submitHandler={ this.handleSubmit } 
          offlineMessage={ sessionT.t<string>(
            'offlineMessage',
            'You must to be connected to at least one hub in order to download filelists from other users') 
          }
        />
         <ShareProfileSelector 
           onProfileChanged={ this.onProfileChanged }
           sessionT={ sessionT }
         />
        <RecentLayout
          entryType={ HistoryEntryEnum.FILELIST }
          hasSession={ this.hasSession }
          entryTitleRenderer={ this.recentUserRender }
          entryIcon={ IconConstants.FILELISTS_PLAIN }
        />
      </div>
    );
  }
}

export default FilelistNew;
