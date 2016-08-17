import React from 'react';

import FilelistActions from 'actions/FilelistActions';

import TypeConvert from 'utils/TypeConvert';
import BrowserBar from 'components/browserbar/BrowserBar';
import { ActionMenu, DownloadMenu } from 'components/menu/DropdownMenu';

import FilelistViewStore from 'stores/FilelistViewStore';
import FilelistSessionStore from 'stores/FilelistSessionStore';

import History from 'utils/History';
//import { Lifecycle } from 'mixins/RouterMixin';

import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, DurationCell, FileDownloadCell } from 'components/table/Cell';
import { Column } from 'fixed-data-table-2';

import IconConstants from 'constants/IconConstants';
import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';


const ListBrowser = React.createClass({
	/*mixins: [ Lifecycle ],

	// Disabled, doesn't work (investigate later)
	componentWillUnmount() {
		clearTimeout(this.historyLeaveTimeout);
	},

	routerWillLeave(nextLocation) {
		if (this.hasClickedDirectory && !this.historyLeaveTimeout && nextLocation.pathname !== this.props.location.pathname) {
			this.historyLeaveTimeout = setTimeout(() => this.historyLeaveTimeout = null, 2000);
			return false;
		}
	},

	contextTypes: {
		route: React.PropTypes.object.isRequired,
		router: React.PropTypes.object.isRequired,
	},*/

	_rowClassNameGetter(rowData) {
		return TypeConvert.dupeToStringType(rowData.dupe);
	},

	_handleClickDirectory(path) {
		this.hasClickedDirectory = true;

		// Handle it through location state data
		History.pushSidebarData(this.props.location, { directory: path });
	},

	componentWillMount() {
		//const { route, router } = this.context;
		//router.setRouteLeaveHook(route, this.routerWillLeave);


		const { session, location } = this.props;

		const locationData = History.getSidebarData(location);
		if (!locationData || !locationData.directory) {
			// We need an initial path for our history
			History.replaceSidebarData(location, { directory: session.location.path });
		} else if (session.location.path !== locationData.directory) {
			// Opening an existing list from another directory?
			this.sendChangeDirectory(locationData.directory);
		}
	},

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
	},

	sendChangeDirectory(directory) {
		FilelistActions.changeDirectory(this.props.session.user.cid, directory);
	},

	emptyRowsNodeGetter() {
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
	},

	onClickDirectory(cellData, rowData) {
		if (rowData.type.id === 'directory') {
			return () => this._handleClickDirectory(this.props.session.location.path + cellData + '/');
		}

		return undefined;
	},

	selectedNameFormatter(caption) {
		return (
			<DownloadMenu 
				caption={ caption }
				user={ this.props.session.user }
				itemInfo={ this.props.session.location }
				handler={ FilelistActions.download } 
			>
				<ActionMenu
					itemData={ {
						directory: this.props.session.location,
						session: this.props.session,
					} }
					actions={ FilelistActions }
					ids={ [ 'reloadDirectory', 'refreshShare' ] } 
				/>
			</DownloadMenu>
		);
	},

	render() {
		const { session } = this.props;
		return (
			<div className="filelist-browser">
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
								userGetter={ _ => session.user }
								handler={ FilelistActions.download } 
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
					{/*<Column
						name="Type"
						width={70}
						columnKey="type"
						flexGrow={1}
						hideWidth={ 500 }
					/>*/}
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
	},
});

export default ListBrowser;
