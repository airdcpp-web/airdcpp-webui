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
	<span>
		{ ValueFormat.formatSize(cellData) }
	</span>
);

export const SpeedCell = ({ cellData, ...props }) => (
	<span>
		{ ValueFormat.formatSpeedIfRunning(cellData) }
	</span>
);

export const DateCell = ({ cellData, ...props }) => (
	<span>
		{ ValueFormat.formatDateTime(cellData) }
	</span>
);

export const ConnectionCell = ({ cellData, ...props }) => (
	<span>
		{ ValueFormat.formatConnection(cellData) }
	</span>
);

export const DecimalCell = ({ cellData, ...props }) => (
	<span>
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