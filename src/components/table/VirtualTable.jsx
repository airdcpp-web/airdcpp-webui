import React from 'react';
import Reflux from 'reflux';

import { Table } from 'fixed-data-table';
import SetContainerSize from 'mixins/SetContainerSize';
import TouchScrollArea	from './TouchScrollArea';

import SocketService from 'services/SocketService';
import TableActions from 'actions/TableActions';

import { Input } from 'react-semantify';

import LocalSettingStore from 'stores/LocalSettingStore'

import './style.css';
import '../../../node_modules/fixed-data-table/dist/fixed-data-table.css';

const NUMBER_OF_ROWS_PER_REQUEST = 10;
const TABLE_ROW_HEIGHT = 50;

const { PropTypes } = React;

// This will handle fetching only when scrolling. Otherwise the data will be updated through the socket listener.
class RowDataLoader {
	constructor(store, onDataLoad) {
		this._onDataLoad = onDataLoad;
		this._store = store;
		this._requestQueue = [];
		this._data = [];
		this._pendingRequest = [];
		this._fetchingActive = false;
	}

	set items(items) {
		items.forEach((obj, index) => {
			let old = this._data[index];
			if (this._data[index]) {
				this._data[index] = React.addons.update(old, { $merge: obj });
			} else {
				this._data[index] = React.addons.update(old, { $set: obj });
			}
		}, this);

		this._onDataLoad();
	}

	set fetchingActive(value) {
		this._fetchingActive = value;
	}
	
	getRowData(rowIndex) {
		if (!this._data[rowIndex]) {
			if (this._fetchingActive) {
				this._queueRequestFor(rowIndex);
			}
			return undefined;
		}
		
		return this._data[rowIndex];
	}

	_hasPendingRequest(rowIndex) {
		const index = this._pendingRequest.find((startRow) => {
			return startRow <= rowIndex && startRow + NUMBER_OF_ROWS_PER_REQUEST >= rowIndex;
		});

		return index;
	}

	_removeRequest(startRow) {
		const index = this._pendingRequest.indexOf(startRow);
		this._pendingRequest.splice(index, 1);
	}
	
	_queueRequestFor(rowIndex) {
		if (this._hasPendingRequest(rowIndex)) {
			return;
		}

		this._requestQueue.push(rowIndex);
		
		if (!this._queueFlushID) {
			this._queueFlushID = setTimeout(this._flushRequestQueue.bind(this), 0);
		}
	}
	
	_flushRequestQueue() {
		const sectionsToLoad = this._requestQueue.reduce((requestSections, rowIndex) => {
			const rowBase = rowIndex - (rowIndex % NUMBER_OF_ROWS_PER_REQUEST);
			if (requestSections.indexOf(rowBase) === -1) {
				return requestSections.concat(rowBase);
			}
			
			return requestSections;
		}, []);
		
		sectionsToLoad.forEach(rowBase => {
			this._loadDataRange(
				rowBase,
				Math.min(rowBase + NUMBER_OF_ROWS_PER_REQUEST, this._store.rowCount)
			);		
		}, this);
		
		this._requestQueue = [];
		this._queueFlushID = null;
	}
		
	_loadDataRange(rowStart, rowEnd) {
		this._pendingRequest.push(rowStart);
		SocketService.get(this._store.viewUrl + '/items/' + rowStart + '/' + rowEnd)
			.then(data => {
				this._removeRequest(rowStart);
				for (let i=0; i < data.length; i++) {
					 this._data[rowStart+i] = data[i];
				}

				this._onDataLoad();
			}.bind(this))
			.catch(error => {
				this._removeRequest(rowStart);
				console.log('Failed to load data: ' + error, this.props.viewName);
			}
			);
	}
}

function convertStartToRows(pixels) {
	return Math.max(Math.floor(pixels / TABLE_ROW_HEIGHT), 0);
}

function convertEndToRows(pixels) {
	return Math.ceil(pixels / TABLE_ROW_HEIGHT);
}

const FilterBox = React.createClass({
	getInitialState: function () {
		return { value: '' };
	},

	componentWillMount: function () {
		this._timer = null;
	},

	componentWillUnmount: function () {
		clearTimeout(this._timer);
	},

	handleChange: function (event) {
		this.setState({ value: event.target.value });

		clearTimeout(this._timer);

		this._timer = setTimeout(() => {
			this._timer = null;
			TableActions.filter(this.props.viewUrl, this.state.value);
		}, 200);
	},

	render: function () {
		return (
			<Input className="filter" onChange={this.handleChange} value={this.state.value} placeholder="Filter..." type="text"/>
		);
	}
});

const TableContainer = React.createClass({
	mixins: [ SetContainerSize, Reflux.listenTo(LocalSettingStore, 'onSettingsChanged') ],

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
		 * Elements to append to the table footer
		 */
		footerData: PropTypes.node,

		/**
		 * ID of the current entity for non-singleton sources
		 */
		entityId: PropTypes.any,		
	},

	onSettingsChanged() {
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
		this._dataLoader = new RowDataLoader(this.props.store, () => this.forceUpdate() );

		this.props.store.init(this.props.entityId);
	},

	componentWillUnmount() {
		TableActions.close(this.props.store.viewUrl);
		this.unsubscribe();
		this.props.store.uninit();
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.entityId !== this.props.entityId) {
			TableActions.close(this.props.store.viewUrl);
			this.props.store.setEntityId(nextProps.entityId);
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

	onItemsUpdated(items) {
		this._dataLoader.items = items;
	},

	componentDidMount() {
		this.unsubscribe = this.props.store.listen(this.onItemsUpdated);
	},

	updateTableSettings() {
		const startRows = convertStartToRows(this._scrollPosition);
		const maxRows = convertEndToRows(this.state.height, true);

		console.log('Settings changed, start: ' + startRows + ', end: ' + maxRows, ', height: ' + this.state.height, this.props.store.viewName);
		TableActions.changeSettings(this.props.store.viewUrl, startRows, maxRows, this.state.sortProperty, this.state.sortAscending);
	},

	_rowGetter(rowIndex) {
		return this._dataLoader.getRowData(rowIndex);
	},
	
	_clearDataForRow(rowIndex) {
		this._dataLoader.clearRowData(rowIndex);
	},
	
	_renderButton(_1, _2, _3, rowIndex) {
		return (<button style={{ width: '100%' }} onClick={this._clearDataForRow.bind(null, rowIndex)}>clear data</button>);
	},

	_onScrollStart(horizontal, vertical) {
		this._dataLoader.fetchingActive = true;
		//console.log("Scrolling started: " + vertical, this.props.store.viewName);
		TableActions.pause(this.props.store.viewUrl, true);
	},

	_onScrollEnd(horizontal, vertical) {
		this._scrollPosition = vertical;
		this._dataLoader.fetchingActive = false;
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

	_renderHeader(label, cellDataKey) {
		return (
			<a onClick={this._sortRowsBy.bind(null, cellDataKey)}>{label}</a>
		);
	},

	_onColumnResizeEndCallback(newColumnWidth, dataKey) {
		this._columnWidths[dataKey] = newColumnWidth;
		this._isColumnResizing = false;
		this.forceUpdate(); // don't do this, use a store and put into this.state!
	},

	_setFilter(pattern) {
		TableActions.filter(this.props.store.viewUrl, pattern);
	},

	_footerDataGetter() {
		return (
			<FilterBox updateFunction={ this._setFilter }/>
		);
	},

	// Fitted-table
	_onContentHeightChange : function (contentHeight) {
		setTimeout(() => {
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

		const rowData = this._dataLoader.getRowData(rowIndex);
		if (!rowData) {
			return null;
		}

		return this.props.rowClassNameGetter(rowData);
	},
	
	render: function () {
		const sortDirArrow = this.state.sortAscending ? ' ↑' : ' ↓';

		// Update and insert generic columns props
		const children = React.Children.map(this.props.children, (column) => {
			if (column.props.hideWidth > this.state.width) {
				return null;
			}

			let label = column.props.label + ((this.state.sortProperty === column.props.dataKey) ? sortDirArrow : '');
			let flexGrow = undefined;
			let width = undefined;
			if (this._columnWidths[column.props.dataKey] != undefined) {
				width = this._columnWidths[column.props.dataKey];
			} else {
				flexGrow = column.props.flexGrow;
				width = column.props.width;
			}

			return React.cloneElement(column, {
				headerRenderer: this._renderHeader,
				label: label,
				flexGrow: flexGrow,
				width: width,
				isResizable: true
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
					footerDataGetter={this._footerDataGetter}
					rowHeight={50}
					rowGetter={this._rowGetter}
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

const VirtualTable = React.createClass({
	render: function () {
		const { footerData, ...other } = this.props;

		return (
			<div className="virtual-table">
				<TableContainer { ...other }/>
				<div className="table-footer">
					{ footerData }
					<FilterBox viewUrl={ this.props.store.viewUrl }/>
				</div>
			</div>
		);
	}
});

export default VirtualTable;
