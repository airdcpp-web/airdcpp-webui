import React from 'react';

import WebUserActions from 'actions/WebUserActions';
import WebUserStore from 'stores/WebUserStore';

import VirtualTable from 'components/table/VirtualTable';
import { ActionMenuCell, DurationCell } from 'components/table/Cell';
import { Column } from 'fixed-data-table';

import AccessConstants from 'constants/AccessConstants';


export const PermissionsCell = ({ cellData }) => (
	<span className="plain permissions cell">
		{ cellData.indexOf(AccessConstants.ADMIN) !== -1 ? 'Administrator' : cellData.length }
	</span>
);

const WebUserLayout = React.createClass({
	render() {
		return (
			<VirtualTable
				store={ WebUserStore }
			>
				<Column
					name="Username"
					width={200}
					columnKey="username"
					cell={
						<ActionMenuCell 
							actions={ WebUserActions }
							ids={[ 'edit', 'remove' ]}
						/> 
					}
					flexGrow={10}
				/>
				<Column
					name="Permissions"
					width={80}
					columnKey="permissions"
					flexGrow={2}
					cell={ <PermissionsCell/> }
				/>
				<Column
					name="Active sessions"
					width={80}
					flexGrow={1}
					columnKey="active_sessions"
				/>
				<Column
					name="Last logged in"
					width={80}
					flexGrow={3}
					columnKey="last_login"
					cell={ <DurationCell/> }
				/>
			</VirtualTable>
		);
	}
});

export default WebUserLayout;