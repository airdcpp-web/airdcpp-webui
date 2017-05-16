import PropTypes from 'prop-types';
import React from 'react';

import { TableActionMenu, TableDownloadMenu } from 'components/menu/DropdownMenu';
import ValueFormat from 'utils/ValueFormat';

import FormattedFile from 'components/format/FormattedFile';
import FormattedIp from 'components/format/FormattedIp';

import Checkbox from 'components/semantic/Checkbox';
import { showAction } from 'utils/ActionUtils';
import { Cell } from 'fixed-data-table-2';


const getCellContent = (cellData) => {
	if (typeof cellData === 'object') {
		return Array.isArray(cellData) ? cellData.length : cellData.str;
	}

	if (typeof cellData === 'boolean') {
		return cellData ? 'Yes' : 'No';
	}

	if (cellData === 0) {
		return null;
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

export const FileActionCell = ({ cellData, rowDataGetter, ...props }) => (
	<TableActionMenu 
		caption={ 
			<FormattedFile 
				typeInfo={ rowDataGetter().type }
				caption={ cellData }
			/>
		}
		itemDataGetter={ rowDataGetter }
		{ ...props }
	/>
);

export const ActionMenuCell = ({ cellData, rowDataGetter, ...props }) => (
	<TableActionMenu 
		caption={ cellData }
		itemDataGetter={ rowDataGetter }
		{ ...props }
	/>
);

export const ActionLinkCell = ({ cellData, rowDataGetter, action, ...props }, context) => {
	if (!showAction(action, rowDataGetter())) {
		return <TextCell cellData={ cellData } rowDataGetter={ rowDataGetter } { ...props }/>;
	}

	return (
		<a className="plain link cell" onClick={ () => action(rowDataGetter(), context.routerLocation) }>
			{ getCellContent(cellData) }
		</a>
	);
};

ActionLinkCell.contextTypes = {
	routerLocation: PropTypes.object.isRequired,
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
	<FormattedIp item={ cellData }/>
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

export const FileDownloadCell = ({ cellData, rowDataGetter, clickHandlerGetter, userGetter, ...props }) => (
	<TableDownloadMenu 
		caption={ 
			<FormattedFile 
				typeInfo={ rowDataGetter().type }
				onClick={ !!clickHandlerGetter && clickHandlerGetter(cellData, rowDataGetter) }
				caption={ cellData }
			/>
		} 
		user={ userGetter(rowDataGetter()) }
		linkCaption={ clickHandlerGetter ? false : true }
		itemInfoGetter={ rowDataGetter }
		{ ...props }
	/>
);

export const CheckboxCell = ({ cellData, rowDataGetter, onChange, ...props }) => (
	<Checkbox 
		checked={ cellData } 
		onChange={ checked => onChange(checked, rowDataGetter()) }
		{ ...props }
	/>
);

CheckboxCell.propTypes = {
	rowDataGetter: PropTypes.func, // REQUIRED
	cellData: PropTypes.bool, // REQUIRED
	onChange: PropTypes.func.isRequired,
};