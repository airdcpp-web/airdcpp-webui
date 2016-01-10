import React from 'react';

import FilelistActions from 'actions/FilelistActions';

import TypeConvert from 'utils/TypeConvert';
import Message from 'components/semantic/Message';
import BrowserBar from 'components/browserbar/BrowserBar';
import { ActionMenu, DownloadMenu } from 'components/menu/DropdownMenu';

import FilelistViewStore from 'stores/FilelistViewStore';
import FilelistSessionStore from 'stores/FilelistSessionStore';

import History from 'utils/History';

import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, DurationCell, FileDownloadCell } from 'components/table/Cell';
import { Column } from 'fixed-data-table';

import Loader from 'components/semantic/Loader';


const ListBrowser = React.createClass({
	// Disabled, doesn't work (investigate later)
	/*componentWillUnmount() {
		clearTimeout(this.historyLeaveTimeout);
	},

	routerWillLeave(nextLocation) {
		if (this.hasClickedDirectory && !this.historyLeaveTimeout && nextLocation.pathname !== this.props.location.pathname) {
			this.historyLeaveTimeout = setTimeout(() => this.historyLeaveTimeout = null, 2000);
			return false;
		}
	},*/

	_rowClassNameGetter(rowData) {
		return TypeConvert.dupeToStringType(rowData.dupe);
	},

	_handleClickDirectory(path) {
		// Handle it through location state data
		History.pushSidebarData(this.props.location, { directory: path });
	},

	componentWillMount() {
		const { item, location } = this.props;

		const data = History.getSidebarData(location);
		if (!data || !data.directory) {
			// We need an initial path for our history
			History.replaceSidebarData(location, { directory: item.location.path }, true);
		} else if (item.location.path !== data.directory) {
			// Opening an existing list from another directory?
			this.sendChangeDirectory(data.directory);
		}
	},

	componentWillReceiveProps(nextProps) {
		const { directory } = History.getSidebarData(nextProps.location);
		if (!directory || nextProps.item.location.path === directory) {
			return;
		}

		const currentData = History.getSidebarData(this.props.location);
		if (currentData && currentData.directory !== directory) {
			// It's our change
			this.sendChangeDirectory(directory);
		} else {
			// Change initiated by another session/GUI, update our location
			History.replaceSidebarData(nextProps.location, { directory: this.props.item.location.path });
		}
	},

	sendChangeDirectory(directory) {
		FilelistActions.changeDirectory(this.props.item.user.cid, directory);
	},

	emptyRowsNodeGetter() {
		const { location } = this.props.item;

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
			return () => this._handleClickDirectory(this.props.item.location.path + cellData + '/');
		}

		return undefined;
	},

	selectedNameFormatter(caption) {
		return (
			<DownloadMenu 
				caption={ caption }
				user={ this.props.item.user }
				itemInfo={ this.props.item.location }
				location={ this.props.location }
				handler={ FilelistActions.download } 
			>
				<ActionMenu
					itemData={ {
						directory: this.props.item.location,
						session: this.props.item,
					} }
					location={ this.props.location }
					actions={ FilelistActions }
					ids={ [ 'reloadDirectory' ] } 
				/>
			</DownloadMenu>
		);
	},

	render() {
		const { item, location } = this.props;
		return (
			<div className="filelist-browser">
				<BrowserBar 
					path={ item.location.path }
					separator="/"
					rootPath="/"
					itemClickHandler={ this._handleClickDirectory }
					selectedNameFormatter={ this.selectedNameFormatter }
				/>

				<VirtualTable
					emptyRowsNodeGetter={ this.emptyRowsNodeGetter }
					rowClassNameGetter={ this._rowClassNameGetter }
					store={ FilelistViewStore }
					entityId={ item.id }
					viewId={ item.location.path }
					sessionStore={ FilelistSessionStore }
				>
					<Column
						name="Name"
						width={200}
						columnKey="name"
						cell={
							<FileDownloadCell 
								clickHandlerGetter={ this.onClickDirectory }
								userGetter={ _ => item.user }
								location={ location }
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
