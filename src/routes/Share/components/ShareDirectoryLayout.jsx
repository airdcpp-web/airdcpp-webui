import React from 'react';

import ShareActions from 'actions/ShareActions';
import ShareRootActions from 'actions/ShareRootActions';
import ShareRootStore from 'stores/ShareRootStore';

import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, ActionCell, DurationCell, FileActionCell } from 'components/table/Cell';
import { Column } from 'fixed-data-table';

import ShareProfileFilter from 'components/table/ShareProfileFilter';

import { ActionMenu } from 'components/menu/DropdownMenu';
import RefreshCell from './RefreshCell';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';
import { LocationContext } from 'mixins/RouterMixin';


const ShareDirectoryLayout = React.createClass({
	mixins: [ LocationContext ],
	render() {
		const editAccess = LoginStore.hasAccess(AccessConstants.SETTINGS_EDIT);
		return (
			<VirtualTable
				store={ ShareRootStore }
				customFilter={ <ShareProfileFilter/> }
				footerData={ 
					<ActionMenu 
						className="top left pointing"
						caption="Actions..." 
						actions={ ShareRootActions }
						header="Share actions"
						triggerIcon="chevron up"
						ids={ [ 'create' ]}
						button={true}
					>
						<ActionMenu 
							actions={ ShareActions }
							ids={ [ 'refresh' ]}
						/>
					</ActionMenu>
				}
			>
				<Column
					name="Virtual name"
					width={120}
					columnKey="virtual_name"
					flexGrow={5}
					cell={
						<FileActionCell 
							actions={ ShareRootActions }
							ids={[ 'edit', 'remove' ]}
						/> 
					}
				/>
				<Column
					name="Size"
					width={60}
					columnKey="size"
					cell={ <SizeCell/> }
					flexGrow={2}
				/>
				<Column
					name="Content"
					width={150}
					columnKey="type"
				/>
				<Column
					name="Path"
					width={200}
					columnKey="path"
					flexGrow={10}
				/>
				<Column
					name="Profiles"
					width={65}
					columnKey="profiles"
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