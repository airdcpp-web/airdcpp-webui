import React from 'react';

import { TableActionMenu } from 'components/Menu';
import ValueFormat from 'utils/ValueFormat';
import { FileNameFormatter } from 'utils/IconFormat';
import { TableDownloadMenu } from 'components/Menu';
import Checkbox from 'components/semantic/Checkbox';

//import { Cell } from 'fixed-data-table';

export const FileActionCell = ({ cellData, rowData, actions, ids, ...props }) => (
	<TableActionMenu 
		caption={ 
			<FileNameFormatter item={ rowData.type }>
				{ cellData }
			</FileNameFormatter> 
		} 
		actions={ actions } 
		ids={ ids } 
		itemData={ rowData }
	/>
);

export const ActionCell = ({ cellData, rowData, actions, ids, ...props }) => (
	<TableActionMenu 
		caption={ cellData }
		actions={ actions } 
		ids={ ids } 
		itemData={ rowData }
	/>
);

export const SizeCell = ({ cellData, ...props }) => (
	<span className="plain size cell">
		{ ValueFormat.formatSize(cellData) }
	</span>
);

export const SpeedCell = ({ cellData, ...props }) => (
	<span className="plain speed cell">
		{ ValueFormat.formatSpeed(cellData) }
	</span>
);

export const DateCell = ({ cellData, ...props }) => (
	<span className="plain date cell">
		{ ValueFormat.formatDateTime(cellData) }
	</span>
);

export const AbbreviatedDurationCell = ({ cellData, ...props }) => (
	<span className="plain abbr-duration cell">
		{ ValueFormat.formatAbbreviatedDuration(cellData) }
	</span>
);

export const ConnectionCell = ({ cellData, ...props }) => (
	<span className="plain connection cell">
		{ ValueFormat.formatConnection(cellData) }
	</span>
);

export const DecimalCell = ({ cellData, ...props }) => (
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
	/>
);