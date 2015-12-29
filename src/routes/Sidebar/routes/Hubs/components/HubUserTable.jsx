import React from 'react';

import HubSessionStore from 'stores/HubSessionStore';
import HubUserViewStore from 'stores/HubUserViewStore';

import { Column } from 'fixed-data-table';
import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, ConnectionCell, IpCell } from 'components/table/Cell';

import { TableUserMenu } from 'components/menu/DropdownMenu';


const NickCell = ({ location, cellData, rowData, ...props }) => (
	<TableUserMenu 
		text={ cellData } 
		user={ rowData }
		location={ location }
		userIcon={true}
	/>
);

const HubUserTable = React.createClass({
	rowClassNameGetter(user) {
		return user.flags.join(' ');
	},

	render() {
		const { item } = this.props;
		return (
			<VirtualTable
				store={ HubUserViewStore }
				entityId={ item.id }
				sessionStore={ HubSessionStore }
				rowClassNameGetter={ this.rowClassNameGetter }
			>
				<Column
					name="Nick"
					width={150}
					columnKey="nick"
					flexGrow={8}
					cell={ <NickCell location={ this.props.location }/> }
				/>
				<Column
					name="Share size"
					width={80}
					columnKey="share_size"
					cell={ <SizeCell/> }
					flexGrow={1}
				/>
				<Column
					name="Description"
					width={90}
					columnKey="description"
					flexGrow={1}
				/>
				<Column
					name="Tag"
					width={150}
					columnKey="tag"
					flexGrow={2}
				/>
				<Column
					name="Download speed"
					width={80}
					columnKey="download_speed"
					cell={ <ConnectionCell/> }
					flexGrow={2}
				/>
				<Column
					name="Upload speed"
					width={80}
					columnKey="upload_speed"
					cell={ <ConnectionCell/> }
					flexGrow={2}
				/>
				<Column
					name="IP (v4)"
					width={120}
					columnKey="ip4"
					flexGrow={3}
					cell={ <IpCell/> }
				/>
				<Column
					name="IP (v6)"
					width={120}
					columnKey="ip6"
					flexGrow={3}
					cell={ <IpCell/> }
				/>
			</VirtualTable>
		);
	}
});

export default HubUserTable;