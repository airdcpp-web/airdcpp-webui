import React from 'react';
import { Column } from 'fixed-data-table';
import classNames from 'classnames';

import { StatusEnum } from 'constants/QueueConstants';
import QueueActions from 'actions/QueueActions';
import VirtualTable from 'components/table/VirtualTable';

import PriorityMenu from './PriorityMenu';
import Progress from 'components/semantic/Progress';
import QueueStore from 'stores/QueueStore';

import { FileActionCell, SizeCell, SpeedCell } from 'components/Cell';

const getStatusClass = (cellData, rowData) => {
	const statusId = cellData.id;
	return classNames(
			{ 'grey': statusId == StatusEnum.STATUS_QUEUED && rowData.speed == 0 },
			{ 'blue': statusId == StatusEnum.STATUS_QUEUED && rowData.speed > 0 },
			{ 'success': statusId >= StatusEnum.STATUS_FINISHED },
			{ 'error': statusId == StatusEnum.STATUS_FAILED_MISSING || 
								statusId == StatusEnum.STATUS_SHARING_FAILED || 
								statusId == StatusEnum.STATUS_HASH_FAILED ||
								statusId == StatusEnum.STATUS_DOWNLOAD_FAILED }
		);
};

const StatusCell = ({ cellData, rowData, ...props }) => (
	<Progress 
		className={getStatusClass(cellData, rowData)}
		caption={cellData.str}
		percent={ (rowData.downloaded_bytes*100) / rowData.size }
	/>
);

const PriorityCell = ({ cellData, rowData, ...props }) => (
	<PriorityMenu itemPrio={ cellData } item={ rowData }/>
);

const Queue = React.createClass({
	isActive(cellData, rowData) {
		return rowData.status.id < StatusEnum.STATUS_DOWNLOADED;
	},

	isRunning(cellData, rowData) {
		return rowData.speed > 0;
	},

	render() {
		return (
			<VirtualTable
				defaultSortProperty="name"
				store={QueueStore}
			>
				<Column
					name="Name"
					width={270}
					flexGrow={5}
					columnKey="name"
					cell={ <FileActionCell actions={ QueueActions } ids={[ 'searchBundle', 'removeBundle' ]}/> }
				/>
				<Column
					name="Size"
					width={100}
					columnKey="size"
					cell={ <SizeCell/> }
				/>
				<Column
					name="Type/content"
					width={150}
					columnKey="type"
					hideWidth={1200}
				/>
				<Column
					name="Sources"
					width={100}
					columnKey="sources"
					renderCondition={ this.isActive }
				/>
				<Column
					name="Status"
					width={300}
					flexGrow={3}
					columnKey="status"
					cell={ <StatusCell/> }
				/>
				<Column
					name="Speed"
					width={100}
					columnKey="speed"
					cell={ <SpeedCell/> }
					renderCondition={ this.isRunning }
				/>
				<Column
					name="Priority"
					width={150}
					columnKey="priority"
					renderCondition={ this.isActive }
					cell={ <PriorityCell/> }
				/>
				{/*<Column
					label="Time added"
					width={100}
					dataKey="time_added"
					cellRenderer={ Formatter.formatDateTime }
				/>
				<Column
					label="Time finished"
					width={100}
					dataKey="time_finished"
					cellRenderer={ Formatter.formatDateTime }
				/>*/}
			</VirtualTable>
		);
	}
});

export default Queue;