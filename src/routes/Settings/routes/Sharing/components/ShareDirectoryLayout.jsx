import React from 'react';

import ShareRootActions from 'actions/ShareRootActions';
import ShareRootStore from 'stores/ShareRootStore';

import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, ActionCell, DurationCell } from 'components/Cell';
import { Column } from 'fixed-data-table';

import ProfileDropdown from './ProfileDropdown';
import RefreshCell from './RefreshCell';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';

import '../style.css';

const ShareDirectoryLayout = React.createClass({
	render() {
		const editAccess = LoginStore.hasAccess(AccessConstants.SETTINGS_EDIT);
		return (
			<VirtualTable
				store={ ShareRootStore }
				customFilter={ <ProfileDropdown/> }
			>
				<Column
					name="Path"
					width={200}
					columnKey="path"
					cell={
						<ActionCell 
							location={ this.props.location }
							actions={ ShareRootActions }
							ids={[ 'edit', 'remove' ]}
						/> 
					}
					flexGrow={10}
				/>
				<Column
					name="Size"
					width={60}
					columnKey="size"
					cell={ <SizeCell/> }
					flexGrow={2}
				/>
				<Column
					name="Virtual name"
					width={100}
					columnKey="virtual_name"
					flexGrow={4}
				/>
				<Column
					name="Profiles"
					width={60}
					columnKey="profiles"
					flexGrow={1}
				/>
				<Column
					name="Last refreshed"
					width={80}
					flexGrow={3}
					columnKey="last_refresh_time"
					cell={ editAccess ? <RefreshCell/> : <DurationCell/> }
				/>
			</VirtualTable>
		);
	}
});

export default ShareDirectoryLayout;