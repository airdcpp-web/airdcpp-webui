import React from 'react';

import ShareRootActions from 'actions/ShareRootActions';
//import { SHARE_ROOT_CREATED, SHARE_ROOT_UPDATED, SHARE_ROOT_REMOVED, SHARE_ROOTS_URL, SHARE_MODULE_URL } from 'constants/ShareConstants';
import ShareRootStore from 'stores/ShareRootStore';

//import Message from 'components/semantic/Message';

import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, ActionCell } from 'components/Cell';
import { Column } from 'fixed-data-table';

import '../style.css';

const ShareDirectoryLayout = React.createClass({
	_handleAddDirectory() {
		ShareRootActions.create();
	},

	render() {
		/*if (!this.state.groupedRoots) {
			return null;
		}

		const sections = Object.keys(this.state.groupedRoots)
					.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
					.reduce(this.getTable, []);

		if (sections.length === 0) {
			return (
				<Message 
					title={ 'No directories to display' }
					description={ Object.keys(this.state.groupedRoots).length === 0 ? 'No shared directories' : 'The selected profile is empty' }
				/>
			);
		}*/

		return (

				<VirtualTable
					//emptyRowsNodeGetter={this.emptyRowsNodeGetter}
					defaultSortProperty="path"
					store={ShareRootStore}
					defaultSortAscending={true}
				>
					<Column
						name="Path"
						width={270}
						columnKey="path"
						cell={
							<ActionCell 
								location={ this.props.location }
								actions={ ShareRootActions }
								ids={[ 'edit', 'remove' ]}
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
					<Column
						name="Virtual name"
						width={150}
						columnKey="virtual_name"
						flexGrow={2}
					/>
					<Column
						name="Profiles"
						width={80}
						columnKey="profiles"
					/>
					{/*<Column
						name="Date"
						width={150}
						columnKey="time"
						cell={ <DateCell/> }
					/>*/}
				</VirtualTable>
		);
	}
});

export default ShareDirectoryLayout;