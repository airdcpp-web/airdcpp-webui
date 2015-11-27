import React from 'react';

import SearchActions from 'actions/SearchActions';
import SearchStore from 'stores/SearchStore';

import { Column } from 'fixed-data-table';
import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, DateCell, ConnectionCell, FileDownloadCell, DecimalCell } from 'components/Cell';

import TypeConvert from 'utils/TypeConvert';
import { TableUserMenu } from 'components/Menu';
import Message from 'components/semantic/Message';


const getUserCaption = (cellData) => {
	let caption = cellData.user.nicks;
	if (cellData.count > 1) {
		caption = cellData.count + ' users (' + caption + ')';
	}

	return caption;
};

const UserCell = ({ location, cellData, rowData, ...props }) => (
	<TableUserMenu 
		text={ getUserCaption(cellData) } 
		user={ cellData.user }
		directory={ rowData.path }
		location={ location }
		userIcon={true}
	/>
);

const ResultTable = React.createClass({
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
					name="Name"
					width={270}
					columnKey="name"
					flexGrow={8}
					cell={ 
						<FileDownloadCell 
							location={ this.props.location }
							handler={ SearchActions.download } 
						/>  
					}
				/>
				<Column
					name="Size"
					width={100}
					columnKey="size"
					cell={ <SizeCell/> }
				/>
				<Column
					name="Relevancy"
					width={85}
					columnKey="relevancy"
					cell={ <DecimalCell/> }
				/>
				<Column
					name="Connection"
					width={100}
					columnKey="connection"
					cell={ <ConnectionCell/> }
				/>
				<Column
					name="Type"
					width={100}
					columnKey="type"
					flexGrow={1}
				/>
				<Column
					name="Users"
					width={150}
					columnKey="users"
					flexGrow={2}
					cell={ <UserCell location={this.props.location}/> }
				/>
				<Column
					name="Date"
					width={150}
					columnKey="time"
					flexGrow={1}
					cell={ <DateCell/> }
				/>
				<Column
					name="Slots"
					width={70}
					columnKey="slots"
				/>
			</VirtualTable>
		);
	}
});

export default ResultTable;