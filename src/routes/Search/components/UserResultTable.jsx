import React from 'react';

import { IpFormatter } from 'utils/IconFormat';
import ValueFormat from 'utils/ValueFormat';

import { UserMenu } from 'components/menu/DropdownMenu';


const UserResult = ({ result }) => (
	<tr>
		<td className="user">
			<UserMenu 
				userIcon={ true }
				user={ result.users.user }
				directory={ result.path }
			/>
		</td>
		<td className="hubs">
			{ result.users.user.hub_names }
		</td>
		<td className="connection">
			{ ValueFormat.formatConnection(result.connection) }
		</td>
		<td className="slots">
			{ result.slots.str }
		</td>
		<td className="ip">
			<IpFormatter item={ result.ip }/>
		</td>
		<td className="path">
			{ result.path }
		</td>
	</tr>
);

const resultSort = (a, b) => a.users.user.nicks.localeCompare(b.users.user.nicks);

const UserResultTable = ({ results }) => (
	<div className="users">
		<h2>Users</h2>
		<table className="ui striped table">
			<thead>
				<tr>
					<th>User</th>
					<th>Hubs</th>
					<th>Connection</th>
					<th>Slots</th>
					<th>IP</th>
					<th>Path</th>
				</tr>
			</thead>
			<tbody>
				{ results.sort(resultSort).map(result => 
					<UserResult 
						key={ result.id }
						result={ result }
					/>) }
			</tbody>
		</table>
	</div>
);

export default UserResultTable;