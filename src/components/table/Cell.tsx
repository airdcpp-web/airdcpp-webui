import PropTypes from 'prop-types';
import React from 'react';

import { TableActionMenu, TableDownloadMenu, TableActionMenuProps } from 'components/menu/DropdownMenu';
import { 
  formatDecimal, formatAbbreviatedDuration, formatConnection, formatDateTime, 
  formatShortDate, formatSize, formatSpeed, formatRelativeTime 
} from 'utils/ValueFormat';

import FormattedFile from 'components/format/FormattedFile';
import FormattedIp from 'components/format/FormattedIp';

import Checkbox, { CheckboxProps } from 'components/semantic/Checkbox';
import { showAction } from 'utils/ActionUtils';
import { Cell, CellProps } from 'fixed-data-table-2';
import { RouterChildContext } from 'react-router';
//import { Location } from 'history';
import { DownloadHandlerType } from 'decorators/menu/DownloadMenuDecorator';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';


const getCellContent = (cellData: any) => {
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
export const TextCell = ({ cellData }: { cellData: any }) => (
  <span className="plain text cell">
    { getCellContent(cellData) }
  </span>
);

// Column header
interface HeaderCellProps extends CellProps {
  onClick: () => void;
  label: React.ReactNode;
  columnKey: string;
}

export const HeaderCell = ({ onClick, label, columnKey, ...props }: HeaderCellProps) => (
  <Cell { ...props }>
    <a onClick={ onClick }>
      { label }
    </a>
  </Cell>
);

export interface ActionCellProps extends RowWrapperCellChildProps, Omit<TableActionMenuProps, 'caption' | 'itemData'> {

}

export const FileActionCell: React.SFC<ActionCellProps> = ({ cellData, rowDataGetter, ...props }) => (
  <TableActionMenu 
    caption={ 
      <FormattedFile 
        typeInfo={ rowDataGetter!().type }
        caption={ cellData }
      />
    }
    itemData={ rowDataGetter! }
    { ...props }
  />
);

export const ActionMenuCell: React.SFC<ActionCellProps> = ({ cellData, rowDataGetter, ...props }) => (
  <TableActionMenu 
    caption={ cellData }
    itemData={ rowDataGetter! }
    { ...props }
  />
);

export interface ActionLinkCellProps extends RowWrapperCellChildProps {
  //action: (itemData: any, location: Location) => void;
  action: UI.ActionType;
}

export const ActionLinkCell: React.SFC<ActionLinkCellProps> = ({ cellData, rowDataGetter, action, ...props }, { router }: RouterChildContext<{}>) => {
  if (!showAction(action, rowDataGetter!())) {
    return (
      <TextCell 
        cellData={ cellData }
        { ...props }
      />
    );
  }

  return (
    <a className="plain link cell" onClick={ () => action(rowDataGetter!(), router.route.location) }>
      { getCellContent(cellData) }
    </a>
  );
};

ActionLinkCell.contextTypes = {
  router: PropTypes.object.isRequired,
};

export interface NumberCellProps extends CellProps {
  cellData: number;
}

export const SizeCell: React.SFC<NumberCellProps> = ({ cellData }) => (
  <span className="plain size cell">
    { formatSize(cellData) }
  </span>
);

export const SpeedCell: React.SFC<NumberCellProps> = ({ cellData }) => (
  <span className="plain speed cell">
    { formatSpeed(cellData) }
  </span>
);

export const DateCell: React.SFC<NumberCellProps> = ({ cellData, width }) => (
  <span className="plain date cell">
    { !!width && width > 150 ? formatDateTime(cellData) : formatShortDate(cellData) }
  </span>
);

export const DurationCell: React.SFC<NumberCellProps> = ({ cellData }) => (
  <span className="plain duration cell">
    { formatRelativeTime(cellData) }
  </span>
);

export const AbbreviatedDurationCell: React.SFC<NumberCellProps> = ({ cellData }) => (
  <span className="plain abbr-duration cell">
    { formatAbbreviatedDuration(cellData) }
  </span>
);

export interface IpCellProps { 
  cellData: API.IP;
}

export const IpCell: React.SFC<IpCellProps> = ({ cellData }) => (
  <FormattedIp item={ cellData }/>
);

export const ConnectionCell: React.SFC<NumberCellProps> = ({ cellData }) => (
  <span className="plain connection cell">
    { formatConnection(cellData) }
  </span>
);

export const DecimalCell: React.SFC<NumberCellProps> = ({ cellData }) => (
  <span className="plain decimal cell">
    { formatDecimal(cellData) }
  </span>
);

export interface FileDownloadCellProps extends RowWrapperCellChildProps {
  userGetter: (rowData: any) => API.HintedUserBase;
  clickHandlerGetter: (cellData: any, rowDataGetter: () => any) => (() => void);
  downloadHandler: DownloadHandlerType;
}

export const FileDownloadCell: React.SFC<FileDownloadCellProps> = ({ cellData, rowDataGetter, clickHandlerGetter, userGetter, downloadHandler, ...props }) => (
  <TableDownloadMenu 
    caption={ 
      <FormattedFile 
        typeInfo={ rowDataGetter!().type }
        onClick={ clickHandlerGetter ? clickHandlerGetter(cellData, rowDataGetter!) : null }
        caption={ cellData }
      />
    } 
    user={ userGetter(rowDataGetter!()) }
    linkCaption={ !!clickHandlerGetter ? false : true }
    itemInfoGetter={ rowDataGetter! }
    downloadHandler={ downloadHandler }
    { ...props }
  />
);

/*FileDownloadCell.propTypes = {
  rowDataGetter: PropTypes.func, // REQUIRED
  cellData: PropTypes.any, // REQUIRED
  userGetter: PropTypes.func.isRequired,
  clickHandlerGetter: PropTypes.func,
  downloadHandler: PropTypes.func.isRequired,
};*/

export interface CheckboxCellProps extends Omit<RowWrapperCellChildProps, 'onChange'>, Omit<CheckboxProps, 'onChange' | 'checked'> {
  onChange: (checked: boolean, rowData: any) => void;
}

export const CheckboxCell: React.SFC<CheckboxCellProps> = ({ cellData, rowDataGetter, onChange, ...props }) => (
  <Checkbox 
    checked={ cellData } 
    onChange={ checked => onChange(checked, rowDataGetter!()) }
    { ...props }
  />
);

/*CheckboxCell.propTypes = {
  rowDataGetter: PropTypes.func, // REQUIRED
  cellData: PropTypes.bool, // REQUIRED
  onChange: PropTypes.func.isRequired,
};*/