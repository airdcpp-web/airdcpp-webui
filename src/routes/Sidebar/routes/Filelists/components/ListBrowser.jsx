import React from 'react';

import FilelistItemActions from 'actions/FilelistItemActions';
import FilelistSessionActions from 'actions/FilelistSessionActions';

import TypeConvert from 'utils/TypeConvert';
import BrowserBar from 'components/browserbar/BrowserBar';
import { ActionMenu, DownloadMenu } from 'components/menu/DropdownMenu';

import FilelistViewStore from 'stores/FilelistViewStore';
import FilelistSessionStore from 'stores/FilelistSessionStore';

import History from 'utils/History';

//import { Lifecycle } from 'mixins/RouterMixin';
//import NotificationActions from 'actions/NotificationActions';

import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, DurationCell, FileDownloadCell } from 'components/table/Cell';
import { Column } from 'fixed-data-table-2';

import IconConstants from 'constants/IconConstants';
import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';


class ListBrowser extends React.Component {
  /*mixins: [ Lifecycle ],

	// Disabled, doesn't work (investigate later)
	// Add RouteContext to parent before enabling

	componentWillUnmount() {
		clearTimeout(this.historyLeaveTimeout);
	},

	routerWillLeave(nextLocation) {
		if (this.hasClickedDirectory && !this.historyLeaveTimeout && nextLocation.pathname !== this.props.location.pathname) {
			this.historyLeaveTimeout = setTimeout(() => this.historyLeaveTimeout = null, 2000);
			NotificationActions.info('Click back again to leave this filelist');
			return false;
		}

		return true;
	},

	contextTypes: {
		route: React.PropTypes.object.isRequired,
		router: React.PropTypes.object.isRequired,
	},*/

  _rowClassNameGetter = (rowData) => {
    return TypeConvert.dupeToStringType(rowData.dupe);
  };

  _handleClickDirectory = (path) => {
    this.hasClickedDirectory = true;

    // Handle it through location state data
    History.pushSidebarData(this.props.location, { directory: path });
  };

  componentWillMount() {
    const { session, location } = this.props;

    const locationData = History.getSidebarData(location);
    if (!locationData || !locationData.directory) {
      // We need an initial path for our history
      History.replaceSidebarData(location, { directory: session.location.path });
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextLocationData = History.getSidebarData(nextProps.location);
    if (!nextLocationData.directory || nextProps.session.location.path === nextLocationData.directory) {
      return;
    }

    const currentLocationData = History.getSidebarData(this.props.location);
    if (currentLocationData && currentLocationData.directory !== nextLocationData.directory) {
      // It's our change
      this.sendChangeDirectory(nextLocationData.directory);
    } else {
      // Change initiated by another session/GUI, update our location
      History.replaceSidebarData(nextProps.location, { directory: nextProps.session.location.path });
    }
  }

  sendChangeDirectory = (directory) => {
    FilelistSessionActions.changeDirectory(this.props.session.user.cid, directory);
  };

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
    if (location.type.files !== 0 || location.type.directories !== 0) {
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
  };

  onClickDirectory = (cellData, rowDataGetter) => {
    if (rowDataGetter().type.id === 'directory') {
      return () => this._handleClickDirectory(this.props.session.location.path + cellData + '/');
    }

    return undefined;
  };

  getCurrentDirectory = () => {
    return this.props.session.location;
  };

  selectedNameFormatter = (caption) => {
    return (
      <DownloadMenu 
        caption={ caption }
        user={ this.props.session.user }
        itemInfoGetter={ this.getCurrentDirectory }
        handler={ FilelistItemActions.download } 
      >
        <ActionMenu
          itemData={ {
            directory: this.props.session.location,
            session: this.props.session,
          } }
          actions={ FilelistItemActions }
        />
      </DownloadMenu>
    );
  };

  userGetter = () => {
    return this.props.session.user;
  };

  render() {
    const { session } = this.props;
    return (
      <div className="browser">
        <BrowserBar 
          path={ session.location.path }
          separator="/"
          rootPath="/"
          itemClickHandler={ this._handleClickDirectory }
          selectedNameFormatter={ this.selectedNameFormatter }
          entityId={ session.id } // Just to make sure that the bar gets re-rendered when the switching to a different session (due to dropdown)
        />

        <VirtualTable
          emptyRowsNodeGetter={ this.emptyRowsNodeGetter }
          rowClassNameGetter={ this._rowClassNameGetter }
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
                handler={ FilelistItemActions.download } 
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
      </div>
    );
  }
}

export default ListBrowser;
