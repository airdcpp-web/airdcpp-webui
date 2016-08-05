import React from 'react';

import QueueActions from 'actions/QueueActions';
import ValueFormat from 'utils/ValueFormat';

import { ActionMenu, UserMenu } from 'components/menu/DropdownMenu';


const Source = ({ source, bundle }) => (
	<tr>
		<td className="user">
			<UserMenu 
				userIcon={ true }
				user={ source.user }
				ids={ [ 'browse', 'message' ] }
			>
				<ActionMenu 
					actions={ QueueActions } 
					ids={ [ 'removeBundleSource' ]} 
					itemData={ {
						source,
						bundle,
					} }
				/>
			</UserMenu>
		</td>
		<td className="hubs">
			{ source.user.hub_names }
		</td>
		<td className="speed">
			{ ValueFormat.formatSpeed(source.last_speed) }
		</td>
		<td className="files">
			{ source.files }
		</td>
		<td className="size">
			{ ValueFormat.formatSize(source.size) }
		</td>
	</tr>
);

const userSort = (a, b) => a.user.nicks.localeCompare(b.user.nicks);

const SourceTable = ({ sources, bundle }) => (
	<div className="sources">
		<h2>Sources</h2>
		<table className="ui striped table">
			<thead>
				<tr>
					<th>User</th>
					<th>Hubs</th>
					<th>Last known speed</th>
					<th>Files</th>
					<th>Size</th>
				</tr>
			</thead>
			<tbody>
				{ sources.sort(userSort).map(source => 
					<Source 
						key={ source.user.cid }
						source={ source }
						bundle={ bundle }
					/>) }
			</tbody>
		</table>
	</div>
);

export default SourceTable;