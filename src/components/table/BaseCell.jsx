import React from 'react';

import { Cell } from 'fixed-data-table';

// Cell components that are used internally by the table

/*const parseWrapperData = ({ columnKey, dataLoader, rowIndex, children, renderCondition, ...props }, onDataLoaded) => {
	const rowData = dataLoader.getRowData(rowIndex, onDataLoaded);
	if (!rowData) {
		//console.log('SKIP RENDER', rowIndex);
		return null;
	}

	if (renderCondition && !renderCondition(rowData[columnKey], rowData)) {
		return null;
	}

	return React.cloneElement(children, {
		cellData: rowData[columnKey],
		rowData: rowData,
		rowIndex: rowIndex,
	});
};

// Generic wrapper for all cells
export const RowWrapperCell = (props) => (
	<div className="row-wrapper" {...props}>
		{ parseWrapperData(props, _ => this.forceUpdate()) }
	</div>
);*/

// Generic wrapper for all cells that will handle data loading
export const RowWrapperCell = React.createClass({
	onDataLoaded() {
		this.forceUpdate();
	},

	render() {
		const { columnKey, dataLoader, rowIndex, children, renderCondition } = this.props;

		const rowData = dataLoader.getRowData(rowIndex, this.onDataLoaded);
		if (!rowData) {
			return null;
		}

		if (renderCondition && !renderCondition(rowData[columnKey], rowData)) {
			return null;
		}

		return (
			<div className="row-wrapper" {...this.props}>
				{ React.cloneElement(children, {
					cellData: rowData[columnKey],
					rowData: rowData,
				}) }
			</div>
		);
	}
});

// Column header
export const HeaderCell = ({ onClick, label, ...props }) => (
	<Cell {...props}>
		<a onClick={onClick}>
			{label}
		</a>
	</Cell>
);

// Default cell
export const TextCell = ({ cellData, ...props }) => (
	<span className="plain text cell">
		{ (typeof cellData === 'object') ? (Array.isArray(cellData) ? cellData.length : cellData.str) : cellData }
	</span>
);
