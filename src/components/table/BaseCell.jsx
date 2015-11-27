import React from 'react';

import { Cell } from 'fixed-data-table';

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

export const RowWrapperCell = (props) => (
	<Cell {...props}>
		{ parseWrapperData(props) }
	</Cell>
);

export const HeaderCell = ({ onClick, label, ...props }) => (
	<Cell {...props}>
		<a onClick={onClick}>
			{label}
		</a>
	</Cell>
);

export const TextCell = ({ cellData, ...props }) => (
	<div>
	{ (typeof cellData === 'object') ? (cellData.str ? cellData.str : 'MOI') : cellData }
	</div>
);
