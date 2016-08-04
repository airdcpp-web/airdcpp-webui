import React from 'react';

import { TableActionMenu, TableDownloadMenu } from 'components/menu/DropdownMenu';
import ValueFormat from 'utils/ValueFormat';
import { FileNameFormatter, IpFormatter } from 'utils/IconFormat';
import Checkbox from 'components/semantic/Checkbox';
import { Cell } from 'fixed-data-table';


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

// Column header
export const HeaderCell = ({ onClick, label, columnKey, ...props }) => (
	<Cell { ...props }>
		<a onClick={ onClick }>
			{ label }
		</a>
	</Cell>
);

export const FileActionCell = ({ cellData, rowData, ...props }) => (
	<TableActionMenu 
		caption={ 
			<FileNameFormatter 
				typeInfo={ rowData.type }
				caption={ cellData }
			/>
		}
		itemData={ rowData }
		{ ...props }
	/>
);

export const ActionMenuCell = ({ cellData, rowData, ...props }) => (
	<TableActionMenu 
		caption={ cellData }
		itemData={ rowData }
		{ ...props }
	/>
);

export const ActionLinkCell = ({ cellData, rowData, action, ...props }, context) => (
	<a className="plain link cell" onClick={ () => action(rowData, context.routerLocation) }>
		{ getCellContent(cellData) }
	</a>
);

ActionLinkCell.contextTypes = {
	routerLocation: React.PropTypes.object.isRequired,
};

export const SizeCell = ({ cellData }) => (
	<span className="plain size cell">
		{ ValueFormat.formatSize(cellData) }
	</span>
);

export const SpeedCell = ({ cellData }) => (
	<span className="plain speed cell">
		{ ValueFormat.formatSpeed(cellData) }
	</span>
);

export const DateCell = ({ cellData, width }) => (
	<span className="plain date cell">
		{ width > 150 ? ValueFormat.formatDateTime(cellData) : ValueFormat.formatShortDate(cellData) }
	</span>
);

export const DurationCell = ({ cellData }) => (
	<span className="plain duration cell">
		{ ValueFormat.formatRelativeTime(cellData) }
	</span>
);

export const AbbreviatedDurationCell = ({ cellData }) => (
	<span className="plain abbr-duration cell">
		{ ValueFormat.formatAbbreviatedDuration(cellData) }
	</span>
);

export const IpCell = ({ cellData }) => (
	<IpFormatter item={ cellData }/>
);

export const ConnectionCell = ({ cellData }) => (
	<span className="plain connection cell">
		{ ValueFormat.formatConnection(cellData) }
	</span>
);

export const DecimalCell = ({ cellData }) => (
	<span className="plain decimal cell">
		{ ValueFormat.formatDecimal(cellData) }
	</span>
);

export const FileDownloadCell = ({ cellData, rowData, clickHandlerGetter, userGetter, ...props }) => (
	<TableDownloadMenu 
		caption={ 
			<FileNameFormatter 
				typeInfo={ rowData.type }
				onClick={ clickHandlerGetter ? clickHandlerGetter(cellData, rowData) : null }
				caption={ cellData }
			/>
		} 
		user={ userGetter(rowData) }
		linkCaption={ clickHandlerGetter ? false : true }
		itemInfo={ rowData }
		{ ...props }
	/>
);

export const CheckboxCell = ({ cellData, rowData, onChange, ...props }) => (
	<Checkbox 
		checked={cellData} 
		onChange={ (checked) => onChange(checked, rowData) }
		{ ...props }
	/>
);