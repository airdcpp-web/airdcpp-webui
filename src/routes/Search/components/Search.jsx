import React from 'react';
import VirtualTable from 'components/table/VirtualTable';
import SocketService from 'services/SocketService';
import SearchActions from 'actions/SearchActions';

import SearchStore from 'stores/SearchStore';
import { HistoryEnum } from 'constants/HistoryConstants';
import { SEARCH_QUERY_URL } from 'constants/SearchConstants';

import HistoryInput from 'components/autosuggest/HistoryInput';

import { Column } from 'fixed-data-table';

import TypeConvert from 'utils/TypeConvert';
import Formatter from 'utils/Format';

import { TableDownloadMenu, TableUserMenu } from 'components/Menu';
import OfflineHubMessageDecorator from 'decorators/OfflineHubMessageDecorator';

import '../style.css';

const SEARCH_PERIOD = 4000;

const Search = React.createClass({
	_handleSearch(text) {
		console.log('Searching');

		clearTimeout(this._searchTimeout);

		SocketService.post(SEARCH_QUERY_URL, { pattern: text })
			.then(data => {
				this.setState({ running:true });
				this._searchTimeout = setTimeout(() => this.setState({ running:false }), data.queue_time + SEARCH_PERIOD);
			})
			.catch(error => 
				console.error('Failed to post search: ' + error)
			);
	},

	getInitialState() {
		return {
			running: false
		};
	},

	_renderStr(cellData, cellDataKey, rowData) {
		if (cellData === undefined) {
			return cellData;
		}

		return cellData.str;
	},

	_renderName(cellData, cellDataKey, rowData) {
		if (cellData === undefined) {
			return cellData;
		}

		const formatter = (
			<Formatter.FileNameFormatter item={ rowData.type }>
				{ cellData }
			</Formatter.FileNameFormatter>);

		return (
			<TableDownloadMenu 
				caption={ formatter }
				itemInfo={ rowData } 
				handler={ SearchActions.download } 
				location={ this.props.location }
			/>
		);
	},

	_renderIp(cellData) {
		if (cellData === undefined) {
			return cellData;
		}

		return <Formatter.IpFormatter item={ cellData }/>;
	},

	_renderUsers(cellData, cellDataKey, rowData) {
		if (cellData === undefined) {
			return cellData;
		}

		let caption = cellData.user.nicks;
		if (cellData.count > 1) {
			caption = cellData.count + ' users (' + caption + ')';
		}

		return <TableUserMenu text={ caption } user={ cellData.user } directory={ rowData.path } location={this.props.location} userIcon={true}/>;
	},

	_rowClassNameGetter(rowData) {
		return TypeConvert.dupeToStringType(rowData.dupe);
	},

	render() {
		return (
			<OfflineHubMessageDecorator offlineMessage="You must to be connected to at least one hub in order to perform searches">
				<div className="search-layout full-height">
					<div className="search-container">
						<div className="search-area">
							<HistoryInput historyId={HistoryEnum.HISTORY_SEARCH} submitHandler={this._handleSearch} running={this.state.running}/>
						</div>
					</div>
					<VirtualTable
						rowClassNameGetter={ this._rowClassNameGetter }
						defaultSortProperty="relevancy"
						defaultSortAscending={false}
						store={ SearchStore }
					>
						<Column
							label="Name"
							width={270}
							dataKey="name"
							cellRenderer={ this._renderName }
							flexGrow={8}
						/>
						<Column
							label="Size"
							width={100}
							dataKey="size"
							cellRenderer={ Formatter.formatSize }
						/>
						<Column
							label="Relevancy"
							width={85}
							dataKey="relevancy"
							cellRenderer={ Formatter.formatDecimal }
						/>
						<Column
							label="Connection"
							width={100}
							dataKey="connection"
							cellRenderer={ Formatter.formatConnection }
						/>
						<Column
							label="Type"
							width={100}
							dataKey="type"
							cellRenderer={ this._renderStr }
							flexGrow={1}
						/>
						<Column
							label="Users"
							width={150}
							dataKey="users"
							flexGrow={2}
							cellRenderer={ this._renderUsers }
						/>
						<Column
							label="Date"
							width={150}
							dataKey="time"
							cellRenderer={ Formatter.formatDateTime }
							flexGrow={1}
						/>
						<Column
							label="Slots"
							width={70}
							dataKey="slots"
							cellRenderer={ this._renderStr }
						/>
					</VirtualTable>
				</div>
			</OfflineHubMessageDecorator>
		);
	}
});

export default Search;
