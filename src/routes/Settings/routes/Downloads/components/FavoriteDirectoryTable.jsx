import React from 'react';

import FavoriteDirectoryActions from 'actions/FavoriteDirectoryActions';
import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';

import ActionButton from 'components/ActionButton';

import DataProviderDecorator from 'decorators/DataProviderDecorator';

import { ActionMenu } from 'components/menu/DropdownMenu';


const Row = ({ directory }) => (
	<tr>
		<td>
			<ActionMenu 
				caption={ <strong>{ directory.name }</strong> } 
				actions={ FavoriteDirectoryActions } 
				ids={ [ 'edit', 'remove' ]} 
				itemData={ directory }
				contextGetter={ _ => '#setting-scroll-context' }
			/>
		</td>
		<td>
			{ directory.path }
		</td>
	</tr>
);

const getRow = (directory) => {
	return (
		<Row 
			key={ directory.path } 
			directory={ directory }
		/>
	);
};

const FavoriteDirectoryPage = ({ directories }) => (
	<div id="directory-table">
		<ActionButton
			action={ FavoriteDirectoryActions.create }
		/>

		{ directories.length === 0 ? null : (
				<table className="ui striped table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Path</th>
						</tr>
					</thead>
					<tbody>
						{ directories.map(getRow) }
					</tbody>
				</table>
			) }
	</div>
);

export default DataProviderDecorator(FavoriteDirectoryPage, {
	urls: {
		directories: FavoriteDirectoryConstants.DIRECTORIES_URL,
	},
	onSocketConnected: (addSocketListener, { refetchData }) => {
		addSocketListener(FavoriteDirectoryConstants.MODULE_URL, FavoriteDirectoryConstants.DIRECTORIES_UPDATED, _ => refetchData());
	},
});