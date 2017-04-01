import React from 'react';

import DataProviderDecorator from 'decorators/DataProviderDecorator';
import FormattedIp from 'components/format/FormattedIp';
import ValueFormat from 'utils/ValueFormat';

import IconConstants from 'constants/IconConstants';
import Message from 'components/semantic/Message';
import SearchConstants from 'constants/SearchConstants';

import { UserMenu } from 'components/menu/DropdownMenu';


const UserResult = ({ result }) => (
	<tr>
		<td className="user dropdown">
			<UserMenu 
				userIcon={ true }
				user={ result.user }
				directory={ result.path }
				ids={ [ 'browse', 'message' ] }
				contextGetter={ _ => '.result.modal' }
			/>
		</td>
		<td className="hubs">
			{ result.user.hub_names }
		</td>
		<td className="connection">
			{ ValueFormat.formatConnection(result.connection) }
		</td>
		<td className="slots">
			{ result.slots.str }
		</td>
		<td className="ip">
			<FormattedIp item={ result.ip }/>
		</td>
		<td className="path">
			{ result.path }
		</td>
	</tr>
);

const resultSort = (a, b) => a.user.nicks.localeCompare(b.user.nicks);

const UserResultTable = ({ results, dataError }) => {
	if (dataError) {
		return (
			<Message 
				title="Failed to load user listing"
				icon={ IconConstants.ERROR }
				description={ dataError.message }
			/>
		);
	}

	return (
		<div className="users">
			<h2>{ 'Users (' + results.length + ')' }</h2>
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
							key={ result.user.cid }
							result={ result }
						/>) }
				</tbody>
			</table>
		</div>
	);
};

export default DataProviderDecorator(UserResultTable, {
	urls: {
		results: ({ parentResult }, socket) => socket.get(SearchConstants.RESULTS_URL + '/' + parentResult.id + '/children'),
	},
	renderOnError: true,
});