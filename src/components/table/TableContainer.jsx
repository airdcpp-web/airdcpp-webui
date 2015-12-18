import React from 'react';
import Reflux from 'reflux';

import { Table } from 'fixed-data-table';
import SetContainerSize from 'mixins/SetContainerSize';
import TouchScrollArea	from './TouchScrollArea';

import TableActions from 'actions/TableActions';
import BrowserUtils from 'utils/BrowserUtils';

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
		 * Append class names to row (takes row data as param)
		 */
		rowClassNameGetter: PropTypes.func,

		/**
		 * ID of the current entity for non-singleton sources
		 */
		entityId: PropTypes.any,

		
		dataLoader: PropTypes.any.isRequired,
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
			top: 0,
			left: 0,
		};
	},

	componentWillMount() {
		this._columnWidths = { };
		this._isColumnResizing = false;
		this._scrollPosition = 0;
	},

	// This will also be used for setting the initial rows
	componentDidUpdate(prevProps, prevState) {
		if (prevState.height != this.state.height) {
			this._onContentHeightChange();
			this.updateRowRange();
		}
	},

	componentWillUnmount() {
		clearTimeout(this._scrollTimer);
	},

	updateRowRange() {
		const startRows = convertStartToRows(this._scrollPosition);
		const maxRows = convertEndToRows(this.state.height, true);

		//console.log('Settings changed, start: ' + startRows + ', end: ' + maxRows, ', height: ' + this.state.height, this.props.store.viewName);

		console.assert(this.props.store.active, 'Posting data for an inactive view');
		TableActions.setRange(this.props.store.viewUrl, startRows, maxRows);
	},

	_onScrollStart(horizontal, vertical) {
		//console.log("Scrolling started: " + vertical, this.props.store.viewName);
		console.assert(this.props.store.active, 'Sending pause for an inactive view');
		TableActions.pause(this.props.store.viewUrl, true);
	},

	_onScrollEnd(horizontal, vertical) {
		this._scrollPosition = vertical;
		console.assert(this.props.store.active, 'Sending pause for an inactive view');
		TableActions.pause(this.props.store.viewUrl, false);

		clearTimeout(this._scrollTimer);
		this._scrollTimer = setTimeout(this.updateRowRange, 500);
		//console.log("Scrolling ended: " + vertical, this.props.store.viewName);
	},

	_sortRowsBy(sortProperty) {
		const { store } = this.props;

		let sortAscending = true;
		if (sortProperty === store.sortProperty && store.sortAscending) {
			sortAscending = false;
		}

		TableActions.setSort(this.props.store.viewUrl, sortProperty, sortAscending);
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

	convertColumn(column) {
		if (column.props.hideWidth > this.state.width) {
			return null;
		}

		let { name, flexGrow, width, cell, columnKey, renderCondition } = column.props;
		const { store } = this.props;

		// Convert name
		const sortDirArrow = store.sortAscending ? ' ↑' : ' ↓';
		name += ((store.sortProperty === columnKey) ? sortDirArrow : '');

		const mobileView = BrowserUtils.useMobileLayout();
		if (!mobileView) {
			// Get column width
			if (this._columnWidths[columnKey] != undefined) {
				width = this._columnWidths[columnKey];
				flexGrow = null;
			}
		}

		return React.cloneElement(column, {
			header: (<HeaderCell onClick={this._sortRowsBy.bind(null, columnKey)} label={name}/>),
			flexGrow: flexGrow,
			width: width,
			isResizable: !mobileView,
			allowCellsRecycling: true,
			cell: (			
				<RowWrapperCell dataLoader={this.props.dataLoader} renderCondition={renderCondition}>
					{ cell ? cell : <TextCell/> }
				</RowWrapperCell>
			),
		});
	},
	
	render: function () {
		if (this.props.emptyRowsNode !== undefined) {
			return this.props.emptyRowsNode;
		}

		//console.log('Render table container, scroll top: ' + this.state.top);

		// Update and insert generic columns props
		const children = React.Children.map(this.props.children, this.convertColumn);

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