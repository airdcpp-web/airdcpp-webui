import React from 'react';
import Reflux from 'reflux';

import { Table } from 'fixed-data-table';
import SetContainerSize from 'mixins/SetContainerSize';
import TouchScrollArea	from './TouchScrollArea';

import TableActions from 'actions/TableActions';

import LocalSettingStore from 'stores/LocalSettingStore';
import { TextCell, RowWrapperCell, HeaderCell } from './BaseCell';

const TABLE_ROW_HEIGHT = 50;
const { PropTypes } = React;

function convertStartToRows(pixels) {
	return Math.max(Math.floor(pixels / TABLE_ROW_HEIGHT), 0);
}

function convertEndToRows(pixels) {
	return Math.ceil(pixels / TABLE_ROW_HEIGHT);
}

const TableContainer = React.createClass({
	mixins: [ SetContainerSize, Reflux.listenTo(LocalSettingStore, 'onLocalSettingsChanged') ],

	propTypes: {

		/**
		 * Store implementing ViewStoreMixin that contains the items
		 */
		store: PropTypes.object.isRequired,

		/**
		 * Store implementing ViewStoreMixin that contains the items
		 */
		defaultSortProperty: PropTypes.string.isRequired,

		/**
		 * Sort ascening by default
		 */
		defaultSortAscending: PropTypes.bool,

		/**
		 * Append class names to row (takes row data as param)
		 */
		rowClassNameGetter: PropTypes.func,

		/**
		 * ID of the current entity for non-singleton sources
		 */
		entityId: PropTypes.any,
	},

	onLocalSettingsChanged() {
		this.forceUpdate();
	},

	getInitialProps() {
		return {
			rowClassNameGetter: null,
			entityId: null
		};
	},

	getInitialState() {
		return {
			sortProperty: this.props.defaultSortProperty,
			sortAscending: this.props.defaultSortAscending !== undefined ? this.props.defaultSortAscending : true
		};
	},

	componentWillMount() {
		this._columnWidths = { };
		this._isColumnResizing = false;
		this._scrollPosition = 0;
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.entityId !== this.props.entityId) {
			this.updateTableSettings();
		}
	},

	componentWillUpdate(nextProps, nextState) {
		if (nextState.height != this.state.height || 
			nextState.sortAscending != this.state.sortAscending ||
			nextState.sortProperty != this.state.sortProperty) {

			setTimeout(this._onContentHeightChange, 0);
			setTimeout(this.updateTableSettings, 0);
		}
	},

	updateTableSettings() {
		const startRows = convertStartToRows(this._scrollPosition);
		const maxRows = convertEndToRows(this.state.height, true);

		console.log('Settings changed, start: ' + startRows + ', end: ' + maxRows, ', height: ' + this.state.height, this.props.store.viewName);
		TableActions.changeSettings(this.props.store.viewUrl, startRows, maxRows, this.state.sortProperty, this.state.sortAscending);
	},

	_rowGetter(rowIndex) {
		return this.props.dataLoader.getRowData(rowIndex);
	},

	_onScrollStart(horizontal, vertical) {
		this.props.dataLoader.fetchingActive = true;
		//console.log("Scrolling started: " + vertical, this.props.store.viewName);
		TableActions.pause(this.props.store.viewUrl, true);
	},

	_onScrollEnd(horizontal, vertical) {
		this._scrollPosition = vertical;
		this.props.dataLoader.fetchingActive = false;
		TableActions.pause(this.props.store.viewUrl, false);

		clearTimeout(this._scrollTimer);
		this._scrollTimer = setTimeout(this.updateTableSettings, 500);
		//console.log("Scrolling ended: " + vertical, this.props.store.viewName);
	},

	_sortRowsBy(cellDataKey) {
		var newState = {
			sortProperty: cellDataKey,
			sortAscending: true
		};

		if (cellDataKey === this.state.sortProperty) {
			newState['sortAscending'] = this.state.sortAscending ? false : true;
		}

		this.setState(newState);
	},

	_onColumnResizeEndCallback(newColumnWidth, dataKey) {
		this._columnWidths[dataKey] = newColumnWidth;
		this._isColumnResizing = false;
		this.forceUpdate(); // don't do this, use a store and put into this.state!
	},

	// Fitted-table
	_onContentHeightChange : function (contentHeight) {
		setTimeout(() => {
			if (!this.refs.touchScrollArea) {
				return;
			}

			let width = 0;
			React.Children.forEach(this.props.children, function (child) {
				if ('width' in child.props) {
					width = width + child.props.width;
				}
			});
			this.refs.touchScrollArea._onContentDimensionsChange(this.state.width, this.state.height-50, width, contentHeight);
		});
	},

	// Fitted-table
	handleScroll : function (left, top) {
		this.setState({
			top: top,
			left: left
		});
	},

	rowClassNameGetter(rowIndex) {
		if (!this.props.rowClassNameGetter) {
			return null;
		}

		const rowData = this.props.dataLoader.getRowData(rowIndex);
		if (!rowData) {
			return null;
		}

		return this.props.rowClassNameGetter(rowData);
	},
	
	render: function () {
		if (this.props.emptyRowsNode !== undefined) {
			return this.props.emptyRowsNode;
		}

		const sortDirArrow = this.state.sortAscending ? ' ↑' : ' ↓';

		// Update and insert generic columns props
		const children = React.Children.map(this.props.children, (column) => {
			if (column.props.hideWidth > this.state.width) {
				return null;
			}

			let label = column.props.name + ((this.state.sortProperty === column.props.dataKey) ? sortDirArrow : '');
			let flexGrow = undefined;
			let width = undefined;
			if (this._columnWidths[column.props.dataKey] != undefined) {
				width = this._columnWidths[column.props.dataKey];
			} else {
				flexGrow = column.props.flexGrow;
				width = column.props.width;
			}

			let { cell } = column.props;
			if (!cell) {
				cell = <TextCell/>;
			}

			cell = (
				<RowWrapperCell dataLoader={this.props.dataLoader} renderCondition={column.props.renderCondition}>
					{ cell }
				</RowWrapperCell>
			);

			return React.cloneElement(column, {
				header: (<HeaderCell onClick={this._sortRowsBy.bind(null, column.props.dataKey)} label={label}/>),
				flexGrow: flexGrow,
				width: width,
				isResizable: true,
				cell: cell,
			});
		}, this);

		const touchMode = LocalSettingStore.touchModeEnabled;
		return (
			<TouchScrollArea handleScroll={this.handleScroll} ref="touchScrollArea" onScrollStart={this._onScrollStart} onScrollEnd={this._onScrollEnd} touchMode={touchMode}>
				<Table
					ref="table"

					width={this.state.width}
					height={this.state.height-50} 
					onContentHeightChange={this._onContentHeightChange}
					scrollTop={this.state.top}
					scrollLeft={this.state.left}
					overflowX={touchMode ? 'hidden' : 'auto'}
					overflowY={touchMode ? 'hidden' : 'auto'}

					rowClassNameGetter={this.rowClassNameGetter}
					rowHeight={50}
					//rowGetter={this._rowGetter}
					rowsCount={this.props.store.rowCount}
					headerHeight={50}
					onScrollStart={this._onScrollStart}
					onScrollEnd={this._onScrollEnd}
					isColumnResizing={this.isColumnResizing}
					onColumnResizeEndCallback={this._onColumnResizeEndCallback}
				>
					{children}
				</Table>
			</TouchScrollArea>
		);
	}
});

export default TableContainer;