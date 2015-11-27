import React from 'react';
import { Column } from 'fixed-data-table';

import FilelistActions from 'actions/FilelistActions';

import TypeConvert from 'utils/TypeConvert';
import Message from 'components/semantic/Message';

import PathBreadcrumb from 'components/PathBreadcrumb';
import VirtualTable from 'components/table/VirtualTable';
import FilelistViewStore from 'stores/FilelistViewStore';
import History from 'utils/History';

import SetContainerSize from 'mixins/SetContainerSize';

import { SizeCell, DateCell, FileDownloadCell } from 'components/Cell';

const ListBrowser = React.createClass({
	mixins: [ SetContainerSize ], // The table won't handle responsive height quickly enough

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

	_tokenizePath() {
		let path = this.props.item.directory;
		return path.split('/').filter(el => el.length != 0);
	},

	_rowClassNameGetter(rowData) {
		return TypeConvert.dupeToStringType(rowData.dupe);
	},

	_handleClickDirectory(path) {
		// Handle it through location state data
		History.pushSidebarData(this.props.location, { directory: path });
	},

	componentWillMount() {
		const data = History.getSidebarData(this.props.location);
		if (!data || !data.directory) {
			// We need an initial path for our history
			History.replaceSidebarData(this.props.location, { directory: this.props.item.directory });
		} else if (this.props.item.directory !== data.directory) {
			// Opening an existing list from another directory?
			this.sendChangeDirectory(data.directory);
		}
	},

	componentWillReceiveProps(nextProps) {
		const { directory } = History.getSidebarData(nextProps.location);
		if (!directory || nextProps.item.directory === directory) {
			return;
		}

		const currentData = History.getSidebarData(this.props.location);
		if (currentData && currentData.directory !== directory) {
			// It's our change
			this.sendChangeDirectory(directory);
		} else {
			// Change initiated by another session/GUI, update our location
			History.replaceSidebarData(nextProps.location, { directory: this.props.item.directory });
		}
	},

	sendChangeDirectory(directory) {
		FilelistActions.changeDirectory(this.props.item.user.cid, directory);
	},

	emptyRowsNodeGetter() {
		return (
			<Message 
				title={ 'No content to display' }
				description={ 'The directory is empty' }
			/>
		);
	},

	nameCaptionGetter(cellData, rowData) {
		let captionText = cellData;
		if (rowData.type.id === 'directory') {
			captionText = (
				<a onClick={ () => this._handleClickDirectory(this.props.item.directory + cellData + '/') }>
					{ cellData }
				</a>
				);
		}

		return captionText;
	},

	render() {
		return (
			<div className="filelist-browser" style={{ height: Math.max(150, this.state.windowHeight - 210) }}>
				<PathBreadcrumb 
					tokens={this._tokenizePath()} 
					separator={"/"} 
					rootPath={"/"} 
					rootName={this.props.item.user.nicks} 
					itemClickHandler={this._handleClickDirectory}
				/>

				<VirtualTable
					emptyRowsNodeGetter={this.emptyRowsNodeGetter}
					rowClassNameGetter={ this._rowClassNameGetter }
					defaultSortProperty="name"
					store={FilelistViewStore}
					entityId={this.props.item.id}
					defaultSortAscending={true}
				>
					<Column
						name="Name"
						width={270}
						columnKey="name"
						cell={
							<FileDownloadCell 
								captionGetter={ this.nameCaptionGetter }
								parentEntity={ this.props.item }
								location={ this.props.location }
								handler={ FilelistActions.download } 
							/> 
						}
						flexGrow={5}
					/>
					<Column
						name="Size"
						width={100}
						columnKey="size"
						cell={ <SizeCell/> }
					/>
					{/*<Column
						label="Type"
						width={100}
						dataKey="type"
						cellRenderer={ this._renderStr }
					/>*/}
					<Column
						name="Date"
						width={150}
						columnKey="time"
						cell={ <DateCell/> }
					/>
				</VirtualTable>
			</div>
		);
	},
});

export default ListBrowser;
