import React from 'react';

import ValueFormat from 'utils/ValueFormat';

import { UserMenu } from 'components/menu/DropdownMenu';

import IconConstants from 'constants/IconConstants';
import Button from 'components/semantic/Button';


const Source = ({ source, handleRemove }) => (
	<tr>
		<td className="user">
			<UserMenu 
				userIcon={ true }
				user={ source.user }
			/>
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
		<td className="remove">
			<Button
				caption="Remove"
				icon={ IconConstants.REMOVE }
				onClick={ () => handleRemove(source) }
			/>
		</td>
	</tr>
);

const userSort = (a, b) => a.user.nicks.localeCompare(b.user.nicks);

const SourceTable = ({ sources, handleRemove }) => (
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
					<th/>
				</tr>
			</thead>
			<tbody>
				{ sources.sort(userSort).map(source => 
					<Source 
						key={ source.user.cid }
						source={ source }
						handleRemove={ handleRemove }
					/>) }
			</tbody>
		</table>
	</div>
);

export default SourceTable;