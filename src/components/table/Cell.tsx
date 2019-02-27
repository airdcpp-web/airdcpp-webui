import React from 'react';

import { TableActionMenu, TableDownloadMenu, TableActionMenuProps } from 'components/menu';
import { 
  formatDecimal, formatAbbreviatedDuration, formatConnection, formatDateTime, 
  formatShortDate, formatSize, formatSpeed, formatRelativeTime 
} from 'utils/ValueFormat';

import FormattedFile from 'components/format/FormattedFile';
import FormattedIp from 'components/format/FormattedIp';

import Checkbox, { CheckboxProps } from 'components/semantic/Checkbox';
import { showAction } from 'utils/ActionUtils';
import { Cell, CellProps } from 'fixed-data-table-2';
//import { withRouter, RouteComponentProps } from 'react-router-dom';
//import { DownloadHandlerType } from 'decorators/menu/DownloadMenuDecorator';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as UI from 'types/ui';
import * as API from 'types/api';
//import { ActionHandlerDecorator, ActionHandlerDecoratorChildProps } from 'decorators/ActionHandlerDecorator';
//import ActionButton, { ActionButtonProps } from 'components/ActionButton';
import { ActionHandlerDecorator } from 'decorators/ActionHandlerDecorator';


const getCellContent = (cellData: any) => {
  if (typeof cellData === 'object') {
    return Array.isArray(cellData) ? cellData.length : cellData.str;
  }

  //if (typeof cellData === 'boolean') {
  //  return cellData ? 'Yes' : 'No';
  //}

  if (cellData === 0) {
    return null;
  }

  return cellData;
};

// Default cell
export const TextCell = ({ cellData }: { cellData?: any }) => (
  <span className="plain text cell">
    { getCellContent(cellData) }
  </span>
);

// Column header
interface HeaderCellProps extends CellProps {
  onClick: () => void;
  label: React.ReactNode;
  columnKey?: string; // REQUIRED, CLONED
}

export const HeaderCell = ({ onClick, label, columnKey, ...props }: HeaderCellProps) => (
  <Cell { ...props }>
    <a onClick={ onClick }>
      { label }
    </a>
  </Cell>
);

export interface ActionCellProps<CellDataT, ItemDataT extends UI.ActionItemDataValueType> extends 
  Omit<RowWrapperCellChildProps<CellDataT, ItemDataT>, 't'>, 
  Omit<TableActionMenuProps<ItemDataT>, 'caption' | 'itemData'> {

}

interface FileItemBase {
  type: API.FileItemType;
}

export const FileActionCell = <CellDataT, ItemDataT extends UI.ActionItemDataValueType & FileItemBase>(
  { cellData, rowDataGetter, ...props }: ActionCellProps<CellDataT, ItemDataT>
) => (
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

export const ActionMenuCell = <CellDataT, ItemDataT extends UI.ActionItemDataValueType>(
  { cellData, rowDataGetter, ...props }: ActionCellProps<CellDataT, ItemDataT>
) => (
  <TableActionMenu 
    caption={ cellData }
    itemData={ rowDataGetter! }
    { ...props }
  />
);

export interface ActionLinkCellProps<CellDataT, ItemDataT extends UI.ActionItemDataValueType> 
  extends RowWrapperCellChildProps<CellDataT, ItemDataT> {
  /*Pick<ActionButtonProps<ItemDataT>, 'actions' | 'actionId'>*/

  //action: (itemData: any, location: Location) => void;
  //action: UI.ActionType<ItemDataT>;
  actions: UI.ModuleActions<ItemDataT>;
  actionId: string;
}

export const ActionLinkCell = <CellDataT, ItemDataT extends UI.ActionItemDataValueType>(
  { 
    cellData, 
    rowDataGetter, 
    //location, 
    //onClickAction, action,
    actions, actionId,
    ...props
  }: ActionLinkCellProps<CellDataT, ItemDataT> /*& ActionHandlerDecoratorChildProps*/
) => {
  const action = actions.actions[actionId]!;
  if (!showAction(action, rowDataGetter!())) {
    return (
      <TextCell 
        cellData={ cellData }
        { ...props }
      />
    );
  }

  return (
    <ActionHandlerDecorator/*<ItemDataT>*/>
      { ({ onClickAction }) => (
        <a 
          className="plain link cell" 
          onClick={ () => onClickAction({
            actionId,
            action,
            moduleId: actions.moduleId,
            itemData: rowDataGetter!(),
          }) }
        >
          { getCellContent(cellData) }
        </a>
      ) }
    </ActionHandlerDecorator>
  );

  /*return (
    <ActionButton
      actions={ actions }
      actionId={ actionId }
      tag="a"
      semanticClassName="plain link cell"
      icon={ null }
      caption={ getCellContent(cellData) }
    />
  );*/
};

//export const ActionLinkCell = ActionHandlerDecorator(ActionLinkCellPlain);

export interface NumberCellProps extends RowWrapperCellChildProps<number, any> {
  cellData?: number;
}

export const SizeCell: React.FC<NumberCellProps> = ({ cellData }) => (
  <span className="plain size cell">
    { formatSize(cellData!) }
  </span>
);

export const SpeedCell: React.FC<NumberCellProps> = ({ cellData }) => (
  <span className="plain speed cell">
    { formatSpeed(cellData!) }
  </span>
);

export const DateCell: React.FC<NumberCellProps> = ({ cellData, width }) => (
  <span className="plain date cell">
    { !!width && width > 150 ? formatDateTime(cellData!) : formatShortDate(cellData!) }
  </span>
);

export const DurationCell: React.FC<NumberCellProps> = ({ cellData }) => (
  <span className="plain duration cell">
    { formatRelativeTime(cellData!) }
  </span>
);

export const AbbreviatedDurationCell: React.FC<NumberCellProps> = ({ cellData }) => (
  <span className="plain abbr-duration cell">
    { formatAbbreviatedDuration(cellData!) }
  </span>
);

export interface IpCellProps { 
  cellData?: API.IP;
}

export const IpCell: React.FC<IpCellProps> = ({ cellData }) => (
  <FormattedIp item={ cellData! }/>
);

export const ConnectionCell: React.FC<NumberCellProps> = ({ cellData }) => (
  <span className="plain connection cell">
    { formatConnection(cellData!) }
  </span>
);

export const DecimalCell: React.FC<NumberCellProps> = ({ cellData }) => (
  <span className="plain decimal cell">
    { formatDecimal(cellData!) }
  </span>
);

export type FileDownloadCellClickHandler = (cellData: any, rowDataGetter: () => any) => (() => void) | undefined;

export interface FileDownloadCellProps<CellDataT, ItemDataT extends UI.ActionItemDataValueType> 
  extends RowWrapperCellChildProps<CellDataT, ItemDataT> {

  userGetter: (rowData: ItemDataT) => API.HintedUserBase;
  clickHandlerGetter?: FileDownloadCellClickHandler;
  downloadHandler: () => void;
}

export const FileDownloadCell = <CellDataT, ItemDataT extends UI.ActionItemDataValueType & FileItemBase>(
  { cellData, rowDataGetter, clickHandlerGetter, 
    userGetter, downloadHandler, ...props 
  }: FileDownloadCellProps<CellDataT, ItemDataT>
) => (
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

// tslint:disable-next-line:max-line-length
export interface CheckboxCellProps extends 
  Omit<RowWrapperCellChildProps<boolean, any>, 'onChange'>, 
  Omit<CheckboxProps, 'onChange' | 'checked'> {
    
  onChange: (checked: boolean, rowData: any) => void;
}

export const CheckboxCell: React.FC<CheckboxCellProps> = ({ cellData, rowDataGetter, onChange, ...props }) => (
  <Checkbox 
    checked={ cellData! } 
    onChange={ checked => onChange(checked, rowDataGetter!()) }
    { ...props }
  />
);

/*CheckboxCell.propTypes = {
  rowDataGetter: PropTypes.func, // REQUIRED
  cellData: PropTypes.bool, // REQUIRED
  onChange: PropTypes.func.isRequired,
};*/