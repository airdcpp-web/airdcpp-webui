import React from 'react';
import { Column } from 'fixed-data-table';
import classNames from 'classnames';

import { StatusEnum } from 'constants/QueueConstants';
import QueueActions from 'actions/QueueActions';
import VirtualTable from 'components/table/VirtualTable';

import PriorityMenu from './PriorityMenu';
import Progress from 'components/semantic/Progress';
import QueueStore from 'stores/QueueStore';

import { ActionMenu } from 'components/menu/DropdownMenu';
import Message from 'components/semantic/Message';

import { FileActionCell, SizeCell, SpeedCell, AbbreviatedDurationCell, DurationCell } from 'components/table/Cell';

import '../style.css';

const getStatusClass = (cellData, rowData) => {
	const statusId = cellData.id;
	return classNames(
			{ 'grey': statusId == StatusEnum.QUEUED && rowData.speed == 0 },
			{ 'blue': statusId == StatusEnum.QUEUED && rowData.speed > 0 },
			{ 'success': statusId >= StatusEnum.FINISHED },
			{ 'error': cellData.failed }
		);
};

const StatusCell = ({ cellData, rowData, ...props }) => (
	<Progress 
		className={ getStatusClass(cellData, rowData) }
		caption={ cellData.str }
		percent={ (rowData.downloaded_bytes*100) / rowData.size }
	/>
);

const PriorityCell = ({ cellData, rowData, ...props }) => (
	<PriorityMenu itemPrio={ cellData } item={ rowData }/>
);

const Queue = React.createClass({
	isActive(cellData, rowData) {
		return rowData.status.id < StatusEnum.DOWNLOADED;
	},

	isFinished(cellData, rowData) {
		return !this.isActive(cellData, rowData);
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
				store={QueueStore}
				footerData={ 
					<ActionMenu 
						className="top left pointing"
						caption="Actions..." 
						actions={ QueueActions }
						header="Queue actions"
						triggerIcon="chevron up"
						ids={ [ 'removeFinished', 'divider', 'resume', 'pause' ]}
						button={true}
					/>
				}
			>
				<Column
					name="Name"
					width={200}
					flexGrow={4}
					columnKey="name"
					cell={ 
						<FileActionCell 
							actions={ QueueActions } 
							ids={[ 'searchBundle', 'removeBundle', 'rescan', 'forceShare' ]}
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
					name="Type/content"
					width={150}
					columnKey="type"
					hideWidth={1000}
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
					width={70}
					columnKey="priority"
					renderCondition={ this.isActive }
					cell={ <PriorityCell/> }
					flexGrow={1}
				/>
				<Column
					name="Added"
					width={100}
					columnKey="time_added"
					cell={ <DurationCell/> }
					hideWidth={1400}
				/>
				<Column
					name="Finished"
					width={100}
					columnKey="time_finished"
					cell={ <DurationCell/> }
					renderCondition={ this.isFinished }
					hideWidth={1200}
				/>
			</VirtualTable>
		);
	}
});

export default Queue;