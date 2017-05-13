import React from 'react';

import DataProviderDecorator from 'decorators/DataProviderDecorator';

import QueueActions from 'actions/QueueActions';
import QueueConstants from 'constants/QueueConstants';

import IconConstants from 'constants/IconConstants';
import Message from 'components/semantic/Message';

import ValueFormat from 'utils/ValueFormat';

import { ActionMenu, UserMenu } from 'components/menu/DropdownMenu';


const Source = ({ source, bundle }) => (
	<tr>
		<td className="user dropdown">
			<UserMenu 
				userIcon={ true }
				user={ source.user }
				ids={ [ 'browse', 'message' ] }
				contextElement=".source.modal"
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
			{ source.last_speed > 0 && ValueFormat.formatSpeed(source.last_speed) }
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

const SourceTable = ({ sources, bundle, dataError }) => {
	if (dataError) {
		return (
			<Message 
				title="Failed to load source listing"
				icon={ IconConstants.ERROR }
				description={ dataError.message }
			/>
		);
	}

	return (
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
					{ sources.sort(userSort).map(source => (
						<Source 
							key={ source.user.cid }
							source={ source }
							bundle={ bundle }
						/>
					)) }
				</tbody>
			</table>
		</div>
	);
};

export default DataProviderDecorator(SourceTable, {
	urls: {
		sources: ({ bundle }, socket) => socket.get(QueueConstants.BUNDLES_URL + '/' + bundle.id + '/sources'),
	},
	onSocketConnected: (addSocketListener, { refetchData, props }) => {
		addSocketListener(QueueConstants.MODULE_URL, QueueConstants.BUNDLE_SOURCES, (data) => {
			// Avoid flickering when there are many bundles running
			if (data.id === props.bundle.id) {
				refetchData();
			}
		});
	},
	renderOnError: true,
});