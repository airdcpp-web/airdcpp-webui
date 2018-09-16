import React from 'react';

import UserSearchInput from 'components/autosuggest/UserSearchInput';
import RecentLayout from 'routes/Sidebar/components/RecentLayout';

import FilelistSessionActions from 'actions/FilelistSessionActions';
import FilelistSessionStore from 'stores/FilelistSessionStore';

import ShareProfileSelector from 'routes/Sidebar/routes/Filelists/components/ShareProfileSelector';
import { HistoryEntryEnum } from 'constants/HistoryConstants';
import { Location } from 'history';

import * as API from 'types/api';


interface FilelistNewProps {
  location: Location;
}

class FilelistNew extends React.Component<FilelistNewProps> {
  handleSubmit = (nick: string | null, user: API.HintedUser) => {
    FilelistSessionActions.createSession(this.props.location, user, FilelistSessionStore);
  }

  onProfileChanged = (profileId: number) => {
    FilelistSessionActions.ownList(this.props.location, profileId, FilelistSessionStore);
  }

  recentUserRender = (entry: API.HistoryItem) => {
    return (
      <a onClick={ _ => this.handleSubmit(null, entry.user!) }>
        { entry.user!.nicks + (entry.description ? ' (' + entry.description + ')' : '') }
      </a> 
    );
  }

  hasSession = (entry: API.HistoryItem) => {
    return FilelistSessionStore.getSession(entry.user!.cid);
  }

  render() {
    return (
      <div className="session new">
        <UserSearchInput 
          submitHandler={ this.handleSubmit } 
          offlineMessage="You must to be connected to at least one hub in order to download filelists from other users"
        />
         <ShareProfileSelector 
           onProfileChanged={ this.onProfileChanged }
         />
        <RecentLayout
          entryType={ HistoryEntryEnum.FILELIST }
          hasSession={ this.hasSession }
          entryTitleRenderer={ this.recentUserRender }
          entryIcon="browser"
        />
      </div>
    );
  }
}

export default FilelistNew;
