import React from 'react';
import { Prompt } from 'react-router-dom';

import FilelistItemActions from 'actions/FilelistItemActions';
import FilelistSessionActions from 'actions/FilelistSessionActions';

import { dupeToStringType } from 'utils/TypeConvert';
import BrowserBar from 'components/browserbar/BrowserBar';
import { ActionMenu, DownloadMenu } from 'components/menu';

import FilelistViewStore from 'stores/FilelistViewStore';
import FilelistSessionStore from 'stores/FilelistSessionStore';

import History from 'utils/History';
import NotificationActions from 'actions/NotificationActions';

import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, DurationCell, FileDownloadCell, FileDownloadCellClickHandler } from 'components/table/Cell';
import { Column } from 'fixed-data-table-2';

import IconConstants from 'constants/IconConstants';
import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import DownloadDialog, { DownloadDialogItemDataGetter } from 'components/download/DownloadDialog';
import { Location } from 'history';

import * as API from 'types/api';
import FilelistConstants from 'constants/FilelistConstants';
import { FilelistItem } from 'types/api';


interface ListBrowserProps {
  session: API.FilelistSession;
  location: Location;
}

type LocationState = { directory: string; } | undefined;

class ListBrowser extends React.Component<ListBrowserProps> {
  hasClickedDirectory: boolean = false;

  routerWillLeave = (nextLocation: Location, action: string) => {
    if (action === 'POP' && this.hasClickedDirectory && nextLocation.pathname !== this.props.location.pathname) {
      this.hasClickedDirectory = false;
      NotificationActions.info({
        title: 'Confirm action',
        message: 'Click the back button again to leave this filelist',
      });
      return false;
    }

    return true;
  }

  rowClassNameGetter = (rowData: API.FilelistItem) => {
    return dupeToStringType(rowData.dupe);
  }

  handleClickDirectory = (path: string) => {
    this.hasClickedDirectory = true;

    // Handle it through location state data
    History.push({
      state: { 
        directory: path
      }
    });
  }

  componentDidMount() {
    const { session, location } = this.props;

    const locationData: LocationState = location.state;
    if (!locationData || !locationData.directory) {
      // We need an initial path for our history
      History.replace({
        state: { 
          directory: session.location.path 
        } as LocationState
      });
    }
  }

  componentDidUpdate(prevProps: ListBrowserProps) {
    const newLocationData: LocationState = this.props.location.state;
    if (!newLocationData || !newLocationData.directory) {
      return;
    }

    if (this.props.session.location.path === newLocationData.directory) {
      // Nothing has changed
      return;
    }

    const oldLocationData: LocationState = prevProps.location.state;
    if (!!oldLocationData && oldLocationData.directory !== newLocationData.directory) {
      // It's our change
      this.sendChangeDirectory(newLocationData.directory);
    } else {
      // Change initiated by another session/GUI, update our location
      History.replace({ 
        state: {
          directory: this.props.session.location.path 
        }
      });
    }
  }

  sendChangeDirectory = (directory: string) => {
    FilelistSessionActions.changeDirectory(this.props.session, directory);
  }

  emptyRowsNodeGetter = () => {
    const { location, state } = this.props.session;

    if (state.id === 'download_failed') {
      return (
        <Message 
          icon={ IconConstants.ERROR }
          title="Download failed"
          description={ state.str }
        />
      );
    }

    // The list finished downloading but the view hasn't updated yet
    const { files, directories } = location.type as API.DirectoryType;
    if (files !== 0 || directories !== 0) {
      return <Loader text="Updating view"/>;
    }

    // The directory was changed but the download state hasn't changed yet
    if (!location.complete) {
      return <Loader text="Preparing download"/>;
    }

    return (
      <Message 
        title={ 'No content to display' }
        description={ 'The directory is empty' }
      />
    );
  }

  onClickDirectory: FileDownloadCellClickHandler = (cellData, rowDataGetter) => {
    if (rowDataGetter().type.id === 'directory') {
      return () => this.handleClickDirectory(this.props.session.location.path + cellData + '/');
    }

    return undefined;
  }

  getCurrentDirectory = () => {
    return this.props.session.location;
  }

  selectedNameFormatter = (caption: React.ReactNode) => {
    return (
      <DownloadMenu 
        caption={ caption }
        user={ this.props.session.user }
        itemInfoGetter={ this.getCurrentDirectory }
        downloadHandler={ FilelistItemActions.download } 
      >
        <ActionMenu
          itemData={ {
            item: this.props.session.location,
            session: this.props.session,
          } }
          actions={ FilelistItemActions }
        />
      </DownloadMenu>
    );
  }

  userGetter = () => {
    return this.props.session.user;
  }

  filelistItemGetter: DownloadDialogItemDataGetter<FilelistItem> = (itemId, socket) => {
    const { session } = this.props;
    return socket.get(`${FilelistConstants.MODULE_URL}/${session.id}/items/${itemId}`);
  }

  render() {
    const { session } = this.props;
    return (
      <div className="browser">
        <Prompt
          message={ this.routerWillLeave as any }
        />

        <BrowserBar 
          path={ session.location.path }
          separator="/"
          rootPath="/"
          itemClickHandler={ this.handleClickDirectory }
          selectedNameFormatter={ this.selectedNameFormatter }

          // Just to make sure that the bar gets re-rendered when the switching to a different session (due to dropdown)
          entityId={ session.id }
        />

        <VirtualTable
          emptyRowsNodeGetter={ this.emptyRowsNodeGetter }
          rowClassNameGetter={ this.rowClassNameGetter }
          store={ FilelistViewStore }
          entityId={ session.id }
          viewId={ session.location.path }
          sessionStore={ FilelistSessionStore }
        >
          <Column
            name="Name"
            width={200}
            columnKey="name"
            cell={
              <FileDownloadCell 
                clickHandlerGetter={ this.onClickDirectory }
                userGetter={ this.userGetter }
                downloadHandler={ FilelistItemActions.download } 
              /> 
            }
            flexGrow={8}
          />
          <Column
            name="Size"
            width={60}
            columnKey="size"
            cell={ <SizeCell/> }
            flexGrow={1}
          />
          <Column
            name="Type"
            width={70}
            columnKey="type"
            flexGrow={1}
            hideWidth={ 500 }
          />
          <Column
            name="Last modified"
            width={80}
            columnKey="time"
            cell={ <DurationCell/> }
            flexGrow={1}
          />
        </VirtualTable>
        <DownloadDialog 
          downloadHandler={ FilelistItemActions.download }
          itemDataGetter={ this.filelistItemGetter }
          userGetter={ this.userGetter }
        />
      </div>
    );
  }
}

export default ListBrowser;
