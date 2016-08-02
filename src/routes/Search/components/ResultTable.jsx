import React from 'react';

import SearchActions from 'actions/SearchActions';
import SearchViewStore from 'stores/SearchViewStore';

import { Column } from 'fixed-data-table';
import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, DurationCell, ConnectionCell, FileDownloadCell, DecimalCell } from 'components/table/Cell';

import TypeConvert from 'utils/TypeConvert';
import { TableUserMenu } from 'components/menu/DropdownMenu';
import Message from 'components/semantic/Message';

import { LocationContext } from 'mixins/RouterMixin';


const getUserCaption = (cellData) => {
	let caption = cellData.user.nicks;
	if (cellData.count > 1) {
		caption = cellData.count + ' users (' + caption + ')';
	}

	return caption;
};

const UserCell = ({ cellData, rowData, ...props }) => (
	<TableUserMenu 
		text={ getUserCaption(cellData) } 
		user={ cellData.user }
		directory={ rowData.path }
		userIcon={ 'simple' }
		ids={ [ 'browse', 'message' ] }
	/>
);

const ResultTable = React.createClass({
	mixins: [ LocationContext ],
	_rowClassNameGetter(rowData) {
		return TypeConvert.dupeToStringType(rowData.dupe);
	},

	emptyRowsNodeGetter() {
		if (this.props.running) {
			return null;
		}

		if (!this.props.searchString) {
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
				store={ SearchViewStore }
				/*footerData={ !this.props.searchString ? null :
					(
						<div className="search-string">
							<i>{ this.props.searchString }</i>
						</div>
					)
				}*/
			>
				<Column
					name="Name"
					width={200}
					columnKey="name"
					flexGrow={8}
					cell={
						<FileDownloadCell 
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
					name="Relevance"
					width={60}
					columnKey="relevance"
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
					cell={ <UserCell/> }
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