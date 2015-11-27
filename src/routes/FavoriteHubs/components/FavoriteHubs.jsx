import React from 'react';

import FavoriteHubActions from 'actions/FavoriteHubActions';
import FavoriteHubPasswordActions from 'actions/FavoriteHubPasswordActions';
import HubActions from 'actions/HubActions';

import { StateEnum } from 'constants/FavoriteHubConstants';

import VirtualTable from 'components/table/VirtualTable';
import { TableActionMenu } from 'components/Menu';
import FavoriteHubStore from 'stores/FavoriteHubStore';

import { Column } from 'fixed-data-table';
import Button from 'components/semantic/Button';

import { CheckboxCell, ActionCell } from 'components/Cell';

import '../style.css';

const ConnectStateCell = React.createClass({
	getIcon() {
		switch (this.props.cellData.id) {
			case StateEnum.STATE_CONNECTING:
				return 'yellow remove';
			case StateEnum.STATE_CONNECTED:
				return 'grey remove';
			case StateEnum.STATE_DISCONNECTED:
				return 'green video play';
		}
	},

	getClickAction() {
		switch (this.props.cellData.id) {
			case StateEnum.STATE_CONNECTING:
			case StateEnum.STATE_CONNECTED:
				return () => HubActions.removeSession(this.props.cellData.current_hub_id);
			case StateEnum.STATE_DISCONNECTED:
				return () => HubActions.createSession(this.props.location, this.props.rowData.hub_url);
		}
	},

	render: function () {
		return (
			<div>
				<i className={ 'icon large link ' + this.getIcon() } onClick={ this.getClickAction() }/>
				{ this.props.cellData.str }
			</div>
		);
	}
});

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
		switch (rowData.connect_state) {
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
						<CheckboxCell
							onChange={ (checked, rowData) => FavoriteHubActions.update(rowData, { auto_connect: checked }) }
						/>
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
					//cellRenderer={ this._renderPassword }
				/>
			</VirtualTable>
		);
	}
});

export default FavoriteHubs;
