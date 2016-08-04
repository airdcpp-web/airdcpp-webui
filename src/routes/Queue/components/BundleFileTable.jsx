import React from 'react';
import { Column } from 'fixed-data-table';

import QueueActions from 'actions/QueueActions';
import VirtualTable from 'components/table/VirtualTable';

import PriorityMenu from './PriorityMenu';
import StatusCell from './StatusCell';
import QueueFileViewStore from 'stores/QueueFileViewStore';
import { FilterMethod } from 'constants/TableConstants';

import Message from 'components/semantic/Message';

import { FileActionCell, SizeCell, SpeedCell, AbbreviatedDurationCell } from 'components/table/Cell';

import '../style.css';


const PriorityCell = ({ cellData, rowData, ...props }) => (
	<PriorityMenu 
		itemPrio={ cellData } 
		item={ rowData }
		prioAction={ QueueActions.setFilePriority }
		autoPrioAction={ QueueActions.setFileAutoPriority }
	/>
);

const BundleFileTable = React.createClass({
	isActive(cellData, rowData) {
		return !rowData.status.finished;
	},

	isRunning(cellData, rowData) {
		return rowData.speed > 0;
	},

	emptyRowsNodeGetter() {
		return (
			<Message 
				title="The queue is empty"
				icon="file outline"
				description="New items can be queued from search or filelists"
			/>
		);
	},

	render() {
		return (
			<VirtualTable
				emptyRowsNodeGetter={ this.emptyRowsNodeGetter }
				store={ QueueFileViewStore }
				defaultFilter={ {
					pattern: this.props.bundle.id,
					method: FilterMethod.EXACT,
					property: 'bundle',
				} }
			>
				<Column
					name="Name"
					width={200}
					flexGrow={4}
					columnKey="name"
					cell={ 
						<FileActionCell 
							actions={ QueueActions } 
							ids={[ 'searchFile', 'removeFile' ]}
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
					name="Status"
					width={120}
					flexGrow={3}
					columnKey="status"
					cell={ <StatusCell/> }
				/>
				<Column
					name="Sources"
					width={60}
					columnKey="sources"
					renderCondition={ this.isActive }
					flexGrow={1}
				/>
				<Column
					name="Time left"
					width={50}
					columnKey="seconds_left"
					renderCondition={ this.isRunning }
					cell={ <AbbreviatedDurationCell/> }
				/>
				<Column
					name="Speed"
					width={50}
					columnKey="speed"
					cell={ <SpeedCell/> }
					renderCondition={ this.isRunning }
					flexGrow={1}
				/>
				<Column
					name="Priority"
					width={80}
					columnKey="priority"
					renderCondition={ this.isActive }
					cell={ <PriorityCell/> }
					flexGrow={1}
				/>
			</VirtualTable>
		);
	}
});

export default BundleFileTable;