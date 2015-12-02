import React from 'react';

import { TableActionMenu } from 'components/Menu';
import ValueFormat from 'utils/ValueFormat';
import { FileNameFormatter } from 'utils/IconFormat';
import { TableDownloadMenu } from 'components/Menu';
import Checkbox from 'components/semantic/Checkbox';

//import { Cell } from 'fixed-data-table';

export const FileActionCell = ({ cellData, rowData, ...props }) => (
	<TableActionMenu 
		caption={ 
			<FileNameFormatter item={ rowData.type }>
				{ cellData }
			</FileNameFormatter> 
		}
		itemData={ rowData }
		{ ...props }
	/>
);

export const ActionCell = ({ cellData, rowData, ...props }) => (
	<TableActionMenu 
		caption={ cellData }
		itemData={ rowData }
		{ ...props }
	/>
);

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

export const DateCell = ({ cellData }) => (
	<span className="plain date cell">
		{ ValueFormat.formatDateTime(cellData) }
	</span>
);

export const AbbreviatedDurationCell = ({ cellData }) => (
	<span className="plain abbr-duration cell">
		{ ValueFormat.formatAbbreviatedDuration(cellData) }
	</span>
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

export const FileDownloadCell = ({ cellData, rowData, captionGetter, ...props }) => (
	<TableDownloadMenu 
		caption={ 
			<FileNameFormatter item={ rowData.type }>
				{ captionGetter ? captionGetter(cellData, rowData) : cellData }
			</FileNameFormatter> 
		} 
		linkCaption={ captionGetter ? false : true }
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