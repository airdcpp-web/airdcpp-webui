import * as React from 'react';
import { Prompt } from 'react-router-dom';

import FilelistItemActions from 'actions/ui/FilelistItemActions';

import BrowserBar from 'components/browserbar/BrowserBar';
import { ActionMenu, DownloadMenu } from 'components/action-menu';

import NotificationActions from 'actions/NotificationActions';

import DownloadDialog from 'components/download/DownloadDialog';
import { Location, History } from 'history';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { FilelistItemGetter } from './item-info-dialog';
import FilelistItemTable from './FilelistItemTable';
import {
  filelistDownloadHandler,
  changeFilelistDirectory,
} from 'services/api/FilelistApi';
import { runBackgroundSocketAction } from 'utils/ActionUtils';
import MenuConstants from 'constants/MenuConstants';

export type FilelistLocationState = { directory: string } | undefined;

interface ListBrowserProps {
  session: API.FilelistSession;
  location: Location<FilelistLocationState>;
  history: History;
  sessionT: UI.ModuleTranslator;
}

class ListBrowser extends React.Component<ListBrowserProps> {
  hasClickedDirectory = false;

  routerWillLeave = (nextLocation: Location, action: string) => {
    if (
      action === 'POP' &&
      this.hasClickedDirectory &&
      nextLocation.pathname !== this.props.location.pathname
    ) {
      const { sessionT } = this.props;
      this.hasClickedDirectory = false;
      NotificationActions.info({
        title: sessionT.t('confirmLeave', 'Confirm action'),
        message: sessionT.t(
          'confirmLeaveDesc',
          'Click the back button again to leave this filelist'
        ),
      });
      return false;
    }

    return true;
  };

  handleClickDirectory = (path: string) => {
    this.hasClickedDirectory = true;
    const { history } = this.props;

    // Handle it through location state data
    history.push({
      state: {
        directory: path,
      },
    });
  };

  componentDidMount() {
    const { session, location, history } = this.props;

    const locationData = location.state;
    if (!locationData || !locationData.directory) {
      // We need an initial path for our history
      history.replace({
        state: {
          directory: session.location!.path,
        } as FilelistLocationState,
      });
    }
  }

  componentDidUpdate(prevProps: ListBrowserProps) {
    const newLocationData = this.props.location.state;
    if (!newLocationData || !newLocationData.directory) {
      return;
    }

    if (this.props.session.location!.path === newLocationData.directory) {
      // Nothing has changed
      return;
    }

    const oldLocationData = prevProps.location.state;
    if (!!oldLocationData && oldLocationData.directory !== newLocationData.directory) {
      // It's our change
      this.sendChangeDirectory(newLocationData.directory);
    } else {
      // Change initiated by another session/GUI, update our location
      this.props.history.replace({
        state: {
          directory: this.props.session.location!.path,
        },
      });
    }
  }

  sendChangeDirectory = (directory: string) => {
    runBackgroundSocketAction(
      () => changeFilelistDirectory(this.props.session, directory),
      this.props.sessionT.plainT
    );
  };

  getCurrentDirectory = () => {
    return this.props.session.location;
  };

  selectedNameFormatter = (caption: React.ReactNode) => {
    const { session } = this.props;
    return (
      <DownloadMenu
        caption={caption}
        user={session.user}
        itemInfoGetter={this.getCurrentDirectory}
        downloadHandler={filelistDownloadHandler}
        contextElement=".session-container"
        session={session}
        remoteMenuId={MenuConstants.FILELIST_ITEM}
        entityId={session.id}
      >
        <ActionMenu
          itemData={{
            item: session.location,
            session,
          }}
          actions={FilelistItemActions}
        />
      </DownloadMenu>
    );
  };

  userGetter = () => {
    return this.props.session.user;
  };

  filelistItemFetcher = FilelistItemGetter(this.props.session);

  render() {
    const { session, sessionT } = this.props;
    return (
      <div className="browser">
        <Prompt message={this.routerWillLeave as any} />

        <BrowserBar
          path={session.location!.path}
          separator="/"
          rootPath="/"
          rootName={sessionT.translate('Root')}
          itemClickHandler={this.handleClickDirectory}
          selectedNameFormatter={this.selectedNameFormatter}
          // Just to make sure that the bar gets re-rendered when the switching to a different session (due to dropdown)
          entityId={session.id}
        />
        <FilelistItemTable
          session={session}
          sessionT={sessionT}
          onClickDirectory={this.handleClickDirectory}
        />
        <DownloadDialog
          downloadHandler={filelistDownloadHandler}
          itemDataGetter={this.filelistItemFetcher}
          userGetter={this.userGetter}
          session={session}
        />
      </div>
    );
  }
}

export default ListBrowser;
