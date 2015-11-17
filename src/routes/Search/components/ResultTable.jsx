import React from 'react';

import SearchActions from 'actions/SearchActions';
import SearchStore from 'stores/SearchStore';

import { Column } from 'fixed-data-table';
import VirtualTable from 'components/table/VirtualTable';

import TypeConvert from 'utils/TypeConvert';
import Formatter from 'utils/Format';

import { TableDownloadMenu, TableUserMenu } from 'components/Menu';

import Message from 'components/semantic/Message';

const ResultTable = React.createClass({
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

	emptyRowsNodeGetter() {
		if (!this.props.searchString || this.props.running) {
			return null;
		}

		return (
			<Message 
				title={ 'No results found for "' + this.props.searchString + '"' }
				description={ (
					<div className="ui bulleted list">
						<div className="item">Ensure that you spelled the words correctly</div>
						<div className="item">Use different keywords</div>
						<div className="item">You are searching too frequently (hubs often have a minimum search interval)</div>
						<div className="item">If you never receive results for common search terms, make sure that your connectivity settings are configured properly</div>
					</div>
				) }
			/>
		);
	},

	render() {
		return (
			<VirtualTable
				emptyRowsNodeGetter={ this.emptyRowsNodeGetter }
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
					flexGrow={1}
					cellRenderer={ this._renderStr }
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
		);
	}
});

export default ResultTable;