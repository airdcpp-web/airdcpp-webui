import React from 'react';

import FavoriteHubActions from 'actions/FavoriteHubActions';
import FavoriteHubPasswordActions from 'actions/FavoriteHubPasswordActions';
import FavoriteHubStore from 'stores/FavoriteHubStore';
import { StateEnum } from 'constants/FavoriteHubConstants';

import VirtualTable from 'components/table/VirtualTable';
import { Column } from 'fixed-data-table';
import { CheckboxCell, ActionCell } from 'components/Cell';
import ConnectStateCell from './ConnectStateCell';

import { TableActionMenu } from 'components/Menu';

import Button from 'components/semantic/Button';

import '../style.css';

const PasswordCell = ({ cellData, rowData, actions, ids, ...props }) => (
	<TableActionMenu 
		caption={ cellData ? <strong>Set</strong> : 'Not set' } 
		actions={ FavoriteHubPasswordActions } 
		ids={ cellData ? [ 'change', 'remove' ] : [ 'create' ] } 
		itemData={ rowData }
	/>
);

const FavoriteHubs = React.createClass({
	_rowClassNameGetter(rowData) {
		switch (rowData.connect_state.id) {
			case StateEnum.STATE_CONNECTING:
				return 'connecting';
			case StateEnum.STATE_CONNECTED:
				return 'connected';
			case StateEnum.STATE_DISCONNECTED:
				return 'disconnected'; 
		}
	},

	_handleAddHub() {
		FavoriteHubActions.create();
	},

	onChangeAutoConnect(checked, rowData) {
		FavoriteHubActions.update(rowData, { auto_connect: checked });
	},

	render() {
		const footerData = (
			<Button
				icon="plus icon"
				onClick={this._handleAddHub}
				caption="Add new"
			/>
		);

		return (
			<VirtualTable
				rowClassNameGetter={ this._rowClassNameGetter }
				defaultSortProperty="name"
				footerData={footerData}
				store={FavoriteHubStore}
			>
				<Column
					name="State"
					width={150}
					columnKey="connect_state"
					cell={ 
						<ConnectStateCell
							location={ this.props.location }
						/> 
					}
				/>
				<Column
					name="Name"
					width={270}
					columnKey="name"
					flexGrow={3}
					cell={ <ActionCell actions={ FavoriteHubActions } ids={[ 'edit', 'remove' ]}/> }
				/>
				<Column
					name="Address"
					width={270}
					columnKey="hub_url"
					flexGrow={2}
				/>
				<Column
					name="Auto connect"
					width={70}
					columnKey="auto_connect"
					cell={
						<CheckboxCell onChange={ this.onChangeAutoConnect }/>
					}
				/>
				<Column
					name="Nick"
					width={100}
					columnKey="nick"
					flexGrow={1}
				/>
				<Column
					name="Password"
					width={100}
					columnKey="has_password"
					cell={ <PasswordCell/> }
				/>
			</VirtualTable>
		);
	}
});

export default FavoriteHubs;
