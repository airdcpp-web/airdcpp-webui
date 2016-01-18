import React from 'react';

import SearchActions from 'actions/SearchActions';
import SearchStore from 'stores/SearchStore';

import { Column } from 'fixed-data-table';
import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, DurationCell, ConnectionCell, FileDownloadCell, DecimalCell } from 'components/table/Cell';

import TypeConvert from 'utils/TypeConvert';
import { TableUserMenu } from 'components/menu/DropdownMenu';
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
		userIcon={ 'simple' }
		ids={ [ 'browse', 'message' ] }
	/>
);

const ResultTable = React.createClass({
	_rowClassNameGetter(rowData) {
		return TypeConvert.dupeToStringType(rowData.dupe);
	},

	emptyRowsNodeGetter() {
		if (!this.props.searchString || this.props.running) {
			return process.env.DEMO_MODE === '1' ? (
				<Message 
					title="Demo content available"
					icon="idea"
					description={ 'Use the search string "demo" to receive results from the demo share' }
				/>
			) : null;
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
				store={ SearchStore }
			>
				<Column
					name="Name"
					width={200}
					columnKey="name"
					flexGrow={8}
					cell={
						<FileDownloadCell 
							location={ this.props.location }
							handler={ SearchActions.download } 
							userGetter={ (rowData) => rowData.users.user }
						/>  
					}
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
					width={80}
					columnKey="type"
					flexGrow={1}
				/>
				<Column
					name="Relevancy"
					width={60}
					columnKey="relevancy"
					cell={ <DecimalCell/> }
					flexGrow={1}
				/>
				<Column
					name="Connection"
					width={60}
					columnKey="connection"
					cell={ <ConnectionCell/> }
					flexGrow={2}
				/>
				<Column
					name="Users"
					width={120}
					columnKey="users"
					flexGrow={3}
					cell={ <UserCell location={this.props.location}/> }
				/>
				<Column
					name="Last modified"
					width={80}
					columnKey="time"
					cell={ <DurationCell/> }
					flexGrow={1}
				/>
				<Column
					name="Slots"
					width={60}
					columnKey="slots"
					flexGrow={1}
				/>
			</VirtualTable>
		);
	}
});

export default ResultTable;