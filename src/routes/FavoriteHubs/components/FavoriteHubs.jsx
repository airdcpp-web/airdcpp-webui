import React from 'react';

import FavoriteHubActions from 'actions/FavoriteHubActions';
import FavoriteHubPasswordActions from 'actions/FavoriteHubPasswordActions';
import { StateEnum } from 'constants/FavoriteHubConstants';

import VirtualTable from 'components/table/VirtualTable';
import { TableActionMenu } from 'components/Menu';
import { FAVORITE_MODAL_ID } from 'constants/OverlayConstants';
import FavoriteHubStore from 'stores/FavoriteHubStore';

import OverlayParentDecorator from 'decorators/OverlayParentDecorator';

import { Column } from 'fixed-data-table';
import Checkbox from 'components/semantic/Checkbox';

import '../style.css';

const ConnectState = React.createClass({
	getTitle() {
		switch (this.props.item.connect_state) {
			case StateEnum.STATE_CONNECTING:
				return 'Connecting';
			case StateEnum.STATE_CONNECTED:
				return 'Connected';
			case StateEnum.STATE_DISCONNECTED:
				return 'Disconnected';
		}
	},

	getIcon() {
		switch (this.props.item.connect_state) {
			case StateEnum.STATE_CONNECTING:
				return 'yellow remove';
			case StateEnum.STATE_CONNECTED:
				return 'grey remove';
			case StateEnum.STATE_DISCONNECTED:
				return 'green video play';
		}
	},

	getClickAction() {
		switch (this.props.item.connect_state) {
			case StateEnum.STATE_CONNECTING:
			case StateEnum.STATE_CONNECTED:
				return () => FavoriteHubActions.disconnect(this.props.item);
			case StateEnum.STATE_DISCONNECTED:
				return () => FavoriteHubActions.connect(this.props.item);
		}
	},

	render: function () {
		return (
			<div>
				<i className={ 'icon large link ' + this.getIcon() } onClick={ this.getClickAction() }/>
				{ this.getTitle() }
			</div>
		);
	}
});

const FavoriteHubs = React.createClass({
	displayName: 'Favorite hubs',
	_renderName(cellData, cellDataKey, rowData) {
		if (cellData === undefined) {
			return cellData;
		}

		return <TableActionMenu caption={ cellData } actions={ FavoriteHubActions } ids={[ 'edit', 'remove' ]} itemData={ rowData }/>;
	},

	_renderConnect(cellData, cellDataKey, rowData) {
		if (cellData === undefined) {
			return cellData;
		}

		return <ConnectState item={ rowData }/>;
	},

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

	_renderAutoConnect(cellData, cellDataKey, rowData) {
		if (cellData === undefined) {
			return cellData;
		}

		return <Checkbox checked={cellData} onChange={ checked => FavoriteHubActions.update(rowData, { auto_connect: checked }) }/>;
	},

	_renderPassword(cellData, cellDataKey, rowData) {
		const caption = (
			<div className="password-column"> 
				{ cellData ? <strong>Set</strong> : 'Not set' } 
			</div>
		);

		return (
			<TableActionMenu
				caption={ caption } 
				actions={ FavoriteHubPasswordActions } 
				ids={ cellData ? [ 'change', 'remove' ] : [ 'create' ] } 
				itemData={ rowData }
			/>
		);
	},

	_handleAddHub() {
		FavoriteHubActions.create();
	},

	render() {
		const footerData = (
			<div className="ui button small" onClick={ this._handleAddHub }>
				<i className="plus icon"></i>
				Add new
			</div>);

		return (
			<VirtualTable
				rowClassNameGetter={ this._rowClassNameGetter }
				defaultSortProperty="name"
				footerData={footerData}
				store={FavoriteHubStore}
			>
				<Column
					label="State"
					width={150}
					dataKey="connect_state"
					cellRenderer={ this._renderConnect }
				/>
				<Column
					label="Name"
					width={270}
					dataKey="name"
					flexGrow={3}
					cellRenderer={ this._renderName }
				/>
				<Column
					label="Address"
					width={270}
					dataKey="hub_url"
					flexGrow={2}
				/>
				<Column
					label="Auto connect"
					width={70}
					dataKey="auto_connect"
					cellRenderer={ this._renderAutoConnect }
				/>
				<Column
					label="Nick"
					width={100}
					dataKey="nick"
					flexGrow={1}
				/>
				<Column
					label="Password"
					width={100}
					dataKey="has_password"
					cellRenderer={ this._renderPassword }
				/>
			</VirtualTable>
		);
	}
});

export default OverlayParentDecorator(FavoriteHubs, FAVORITE_MODAL_ID);
