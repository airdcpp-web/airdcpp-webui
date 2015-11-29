import React from 'react';

import ShareRootActions from 'actions/ShareRootActions';
import ShareRootStore from 'stores/ShareRootStore';

//import Message from 'components/semantic/Message';

import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, ActionCell } from 'components/Cell';
import { Column } from 'fixed-data-table';

import ProfileDropdown from './ProfileDropdown';
import RefreshCell from './RefreshCell';

import '../style.css';

const ShareDirectoryLayout = React.createClass({
	_handleAddDirectory() {
		ShareRootActions.create();
	},

	render() {
		/*if (sections.length === 0) {
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
				filter={ <ProfileDropdown/> }
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
				<Column
					name="Last refreshed"
					width={150}
					columnKey="last_refresh_time"
					cell={ <RefreshCell/> }
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