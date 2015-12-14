import React from 'react';

import TableActions from 'actions/TableActions';

import TableFooter from './TableFooter';
import TableContainer from './TableContainer';
import RowDataLoader from './RowDataLoader';

import LoginStore from 'stores/LoginStore';

import './style.css';
import 'fixed-data-table/dist/fixed-data-table.css';


const VirtualTable = React.createClass({
	propTypes: {
		/**
		 * Elements to append to the table footer
		 */
		footerData: React.PropTypes.node,

		/**
		 * Returns a node to render if there are no rows to display
		 */
		emptyRowsNodeGetter: React.PropTypes.func,

		/**
		 * Possible ID of the current view (items will be cleared when the ID changes)
		 */
		viewId: React.PropTypes.any,

		/**
		 * Store containing sessions (must be provided together with entityId)
		 */
		sessionStore: React.PropTypes.object,

		/**
		 * Custom filter that will be displayed in addition to regular text filter
		 */
		customFilter: React.PropTypes.node,
	},

	componentWillMount() {
		this._dataLoader = new RowDataLoader(this.props.store, () => this.forceUpdate() );

		this.start(this.props.entityId);
	},

	componentDidMount() {
		this.unsubscribe = this.props.store.listen(this.onItemsUpdated);
	},

	componentWillUnmount() {
		this.close();
		this.unsubscribe();
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.entityId !== this.props.entityId) {
			this.close();

			this.start(nextProps.entityId);
		}

		if (nextProps.viewId != this.props.viewId) {
			TableActions.clear(this.props.store.viewUrl);
		}
	},

	moduleExists() {
		if (!this.props.entityId) {
			return true;
		}

		return this.props.sessionStore.getSession(this.props.entityId);
	},

	start(entityId) {
		const { store } = this.props;

		TableActions.init(store.viewUrl, entityId);
		TableActions.setSort(store.viewUrl, store.sortProperty, store.sortAscending);
	},

	close() {
		if (LoginStore.socketAuthenticated) {
			// Don't send the close command if the session was removed
			TableActions.close(this.props.store.viewUrl, this.moduleExists());
		}
	},

	onItemsUpdated(items, rangeOffset) {
		this._dataLoader.onItemsUpdated(items, rangeOffset);
		this._dataLoader.items = items;
		//this.rangeOffset = rangeOffset;
	},

	render: function () {
		const { footerData, emptyRowsNodeGetter, ...other } = this.props;

		if (this.props.emptyRowsNodeGetter && this.props.store.totalCount === 0) {
			return this.props.emptyRowsNodeGetter();
		}

		//console.log('Render virtual table');
		return (
			<div className="virtual-table">
				<TableContainer 
					{ ...other }
					dataLoader={this._dataLoader}
				/>

				<TableFooter
					store={ this.props.store }
					customFilter={ this.props.customFilter }
					footerData={ footerData }
				/>
			</div>
		);
	}
});

export default VirtualTable;
