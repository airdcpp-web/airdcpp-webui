import React from 'react';

import { Cell } from 'fixed-data-table';

// Cell components that are used internally by the table


// Generic wrapper for all cells that will handle data loading
export const RowWrapperCell = React.createClass({
	getInitialState() {
		return {
			rowData: null,
		};
	},

	componentDidMount() {
		this.loadData(this.props.rowIndex);
	},

	componentWillReceiveProps(nextProps) {
		// Check if there is new data available (rowIndex may have changed as well)
		if (!this.loadData(nextProps.rowIndex)) {
			// Avoid displaying old data
			this.setState({ rowData: null });
		}
	},

	loadData(rowIndex) {
		return this.props.dataLoader.updateRowData(rowIndex, this.onDataLoaded);
	},

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.rowData !== this.state.rowData || 
			nextProps.width !== this.props.width;
	},

	onDataLoaded(data) {
		if (this.isMounted()) {
			this.setState({ rowData: data });
		}
	},

	render() {
		const { columnKey, children, renderCondition, ...other } = this.props;
		const { rowData } = this.state;

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
					...other,
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

const getCellContent = (cellData) => {
	if (typeof cellData === 'object') {
		return Array.isArray(cellData) ? cellData.length : cellData.str;
	}

	if (typeof cellData === 'boolean') {
		return cellData ? 'Yes' : 'No';
	}

	return cellData;
};

// Default cell
export const TextCell = ({ cellData, ...props }) => (
	<span className="plain text cell">
		{ getCellContent(cellData) }
	</span>
);
