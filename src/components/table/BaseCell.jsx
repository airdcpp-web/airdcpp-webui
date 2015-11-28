import React from 'react';

import { Cell } from 'fixed-data-table';

// Cell components that are used internally by the table

const parseWrapperData = ({ columnKey, dataLoader, rowIndex, children, renderCondition, ...props }) => {
	const rowData = dataLoader.getRowData(rowIndex);
	if (!rowData) {
		return null;
	}

	if (renderCondition && !renderCondition(rowData[columnKey], rowData)) {
		return null;
	}

	return React.cloneElement(children, {
		cellData: rowData[columnKey],
		rowData: rowData,
	});
};

// Generic wrapper for all cells
export const RowWrapperCell = (props) => (
	<div className="row-wrapper" {...props}>
		{ parseWrapperData(props) }
	</div>
);

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
