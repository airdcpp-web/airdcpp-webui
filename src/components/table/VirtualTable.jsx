import React from 'react';

import TableActions from 'actions/TableActions';

import FilterBox from './FilterBox';
import TableContainer from './TableContainer';
import RowDataLoader from './RowDataLoader';

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
	},

	componentWillMount() {
		this._dataLoader = new RowDataLoader(this.props.store, () => this.forceUpdate() );

		this.props.store.init(this.props.entityId);
	},

	componentDidMount() {
		this.unsubscribe = this.props.store.listen(this.onItemsUpdated);
	},

	componentWillUnmount() {
		TableActions.close(this.props.store.viewUrl);

		this.unsubscribe();
		this.props.store.uninit();
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.entityId !== this.props.entityId) {
			this.updateTableSettings();
		}
	},

	onItemsUpdated(items) {
		this._dataLoader.items = items;
	},

	render: function () {
		const { footerData, emptyRowsNodeGetter, ...other } = this.props;

		// We can't render this here because the table must be kept mounted and receiving updates
		let emptyRowsNode;
		if (this.props.emptyRowsNodeGetter && this.props.store.rowCount === 0) {
			emptyRowsNode = this.props.emptyRowsNodeGetter();

			// null won't work because we must be able to get the dimensions
			if (emptyRowsNode === null) {
				emptyRowsNode = (<div></div>);
			}
		}

		return (
			<div className="virtual-table">
				<TableContainer { ...other } emptyRowsNode={emptyRowsNode} dataLoader={this._dataLoader}/>
				{ emptyRowsNode === undefined ? (
					<div className="table-footer">
						{ footerData }
						<div className="filter">
							<FilterBox viewUrl={ this.props.store.viewUrl }/>
							{ this.props.filter ? React.cloneElement(this.props.filter, { viewUrl: this.props.store.viewUrl }) : null }
						</div>
					</div>
				) : null }
			</div>
		);
	}
});

export default VirtualTable;
