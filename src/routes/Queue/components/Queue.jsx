import React from 'react';
import { Column } from 'fixed-data-table-2';

import QueueActions from 'actions/QueueActions';
import QueueBundleActions from 'actions/QueueBundleActions';
import VirtualTable from 'components/table/VirtualTable';

import PriorityMenu from './PriorityMenu';
import StatusCell from './StatusCell';
import QueueBundleViewStore from 'stores/QueueBundleViewStore';

import { ActionMenu } from 'components/menu/DropdownMenu';
import Message from 'components/semantic/Message';

import { ActionLinkCell, FileActionCell, SizeCell, SpeedCell, AbbreviatedDurationCell, DurationCell } from 'components/table/Cell';
import { LocationContext } from 'mixins/RouterMixin';

import '../style.css';


const PriorityCell = ({ cellData, rowDataGetter, ...props }) => (
	<PriorityMenu 
		itemPrio={ cellData } 
		item={ rowDataGetter() }
		prioAction={ QueueBundleActions.setBundlePriority }
	/>
);

const Queue = React.createClass({
	mixins: [ LocationContext ],
	isActive(cellData, rowData) {
		return !rowData.status.downloaded;
	},

	isDownloaded(cellData, rowData) {
		return rowData.status.downloaded;
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
				store={ QueueBundleViewStore }
				footerData={ 
					<ActionMenu 
						className="top left pointing"
						caption="Actions..." 
						actions={ QueueActions }
						header="Queue actions"
						triggerIcon="chevron up"
						button={ true }
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
							actions={ QueueBundleActions } 
							ids={[ 
								'content', 'sources', 
								'divider', 
								'search', 'searchBundleAlternates',
								'divider', 
								'removeBundle', 
								'divider', 
								'rescan', 'forceShare' 
							]}
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
					cell={ <ActionLinkCell action={ QueueBundleActions.content }/> }
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
					cell={ <ActionLinkCell action={ QueueBundleActions.sources }/> }
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
					renderCondition={ this.isDownloaded }
					hideWidth={1200}
				/>
			</VirtualTable>
		);
	}
});

export default Queue;