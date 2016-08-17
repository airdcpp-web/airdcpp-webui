import React from 'react';

import HubSessionStore from 'stores/HubSessionStore';
import HubUserViewStore from 'stores/HubUserViewStore';

import { Column } from 'fixed-data-table-2';
import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, ConnectionCell, IpCell } from 'components/table/Cell';

import { TableUserMenu } from 'components/menu/DropdownMenu';
import { ConnectStateEnum } from 'constants/HubConstants';

import Message from 'components/semantic/Message';
import Loader from 'components/semantic/Loader';


const NickCell = ({ cellData, rowData, ...props }) => (
	<TableUserMenu 
		text={ cellData } 
		user={ rowData }
		userIcon={ true }
	/>
);

const HubUserTable = React.createClass({
	propTypes: {
		session: React.PropTypes.object, // required

		//location: React.PropTypes.object, // required
	},

	//contextTypes: {
	//	routerLocation: React.PropTypes.object.isRequired,
	//},

	rowClassNameGetter(user) {
		return user.flags.join(' ');
	},

	emptyRowsNodeGetter() {
		const connectState = this.props.session.connect_state.id;

		if (connectState === ConnectStateEnum.DISCONNECTED) {
			return (
				<div className="offline-message">
					<Message 
						className="offline"
						title="Not connected to the hub"
						icon="plug"
					/>
				</div>
			);
		} 

		const text = connectState !== ConnectStateEnum.CONNECTED ? 'Connecting' : 'Loading userlist';
		return (
			<div className="loader-wrapper">
				<Loader text={ text }/>
			</div>
		);
	},

	render() {
		const { session } = this.props;
		return (
			<VirtualTable
				store={ HubUserViewStore }
				entityId={ session.id }
				sessionStore={ HubSessionStore }
				rowClassNameGetter={ this.rowClassNameGetter }
				emptyRowsNodeGetter={ this.emptyRowsNodeGetter }
			>
				<Column
					name="Nick"
					width={170}
					columnKey="nick"
					flexGrow={8}
					cell={ 
						<NickCell/> 
					}
				/>
				<Column
					name="Share size"
					width={85}
					columnKey="share_size"
					cell={ <SizeCell/> }
					flexGrow={1}
				/>
				<Column
					name="Description"
					width={100}
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
					name="Upload speed"
					width={80}
					columnKey="upload_speed"
					cell={ <ConnectionCell/> }
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