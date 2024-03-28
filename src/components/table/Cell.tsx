import * as React from 'react';

import {
  TableActionMenu,
  TableDownloadMenu,
  TableActionMenuProps,
  TableDownloadMenuProps,
} from 'components/action-menu';
import {
  formatDecimal,
  formatAbbreviatedDuration,
  formatConnection,
  formatDateTime,
  formatShortDate,
  formatSize,
  formatSpeed,
  formatRelativeTime,
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
  <span className="plain text cell">{getCellContent(cellData)}</span>
);

// Column header
interface HeaderCellProps extends CellProps {
  onClick: () => void;
  label: React.ReactNode;
  columnKey?: string; // REQUIRED, CLONED
}

export const HeaderCell = ({ onClick, label, columnKey, ...props }: HeaderCellProps) => (
  <Cell {...props}>
    <a onClick={onClick}>{label}</a>
  </Cell>
);

export interface ActionCellProps<
  CellDataT,
  ItemDataT extends UI.ActionMenuItemDataValueType,
> extends Omit<RowWrapperCellChildProps<CellDataT, ItemDataT>, 't' | 'children'>,
    Omit<TableActionMenuProps<ItemDataT>, 'caption' | 'itemData'> {}

interface FileItemBase {
  type: API.FileItemType;
}

export const FileActionCell = <
  CellDataT extends React.ReactNode,
  ItemDataT extends UI.ActionMenuItemDataValueType & FileItemBase,
>({
  cellData,
  rowDataGetter,
  children,
  ...props
}: ActionCellProps<CellDataT, ItemDataT>) => (
  <TableActionMenu
    caption={
      <FormattedFile
        typeInfo={rowDataGetter!().type}
        caption={cellData}
        className="icon-caption"
      />
    }
    itemData={rowDataGetter!}
    {...props}
  />
);

export const ActionMenuCell = <
  CellDataT extends React.ReactNode,
  ItemDataT extends UI.ActionMenuItemDataValueType,
>({
  cellData,
  rowDataGetter,
  ...props
}: ActionCellProps<CellDataT, ItemDataT>) => (
  <TableActionMenu caption={cellData} itemData={rowDataGetter!} {...props} />
);

export interface ActionLinkCellProps<
  CellDataT,
  ItemDataT extends UI.ActionMenuItemDataValueType,
> extends RowWrapperCellChildProps<CellDataT, ItemDataT> {
  /*Pick<ActionButtonProps<ItemDataT>, 'actions' | 'actionId'>*/

  //action: (itemData: any, location: Location) => void;
  //action: UI.ActionType<ItemDataT>;
  action: UI.ActionDefinition<ItemDataT>;
  moduleData: UI.ActionModuleData;
  // actionId: string;
}

export const ActionLinkCell = <
  CellDataT,
  ItemDataT extends UI.ActionMenuItemDataValueType,
>(
  {
    cellData,
    rowDataGetter,
    //location,
    //onClickAction, action,
    action,
    moduleData,
    ...props
  }: ActionLinkCellProps<CellDataT, ItemDataT> /*& ActionHandlerDecoratorChildProps*/,
) => {
  if (!showAction(action, rowDataGetter!())) {
    return <TextCell cellData={cellData} {...props} />;
  }

  return (
    <ActionHandlerDecorator<ItemDataT>>
      {({ onClickAction }) => (
        <a
          className="plain link cell"
          onClick={() =>
            onClickAction({
              action,
              moduleData,
              itemData: rowDataGetter!(),
            })
          }
        >
          {getCellContent(cellData)}
        </a>
      )}
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

export const SizeCell: React.FC<NumberCellProps> = ({ cellData, t }) => (
  <span className="plain size cell">{formatSize(cellData!, t!)}</span>
);

export const SpeedCell: React.FC<NumberCellProps> = ({ cellData, t }) => (
  <span className="plain speed cell">{formatSpeed(cellData!, t!)}</span>
);

export const DateCell: React.FC<NumberCellProps> = ({ cellData, width }) => (
  <span className="plain date cell">
    {!!width && width > 150 ? formatDateTime(cellData!) : formatShortDate(cellData!)}
  </span>
);

export const DurationCell: React.FC<NumberCellProps> = ({ cellData }) => (
  <span className="plain duration cell">{formatRelativeTime(cellData!)}</span>
);

export const AbbreviatedDurationCell: React.FC<NumberCellProps> = ({ cellData }) => (
  <span className="plain abbr-duration cell">{formatAbbreviatedDuration(cellData!)}</span>
);

export interface IpCellProps {
  cellData?: API.IP;
}

export const IpCell: React.FC<IpCellProps> = ({ cellData }) => (
  <FormattedIp item={cellData!} />
);

export const ConnectionCell: React.FC<NumberCellProps> = ({ cellData, t }) => (
  <span className="plain connection cell">{formatConnection(cellData!, t!)}</span>
);

export const DecimalCell: React.FC<NumberCellProps> = ({ cellData }) => (
  <span className="plain decimal cell">{formatDecimal(cellData!)}</span>
);

export type FileDownloadCellClickHandler = (
  cellData: any,
  rowDataGetter: () => any,
) => (() => void) | undefined;

export interface FileDownloadCellProps<
  CellDataT,
  ItemDataT extends UI.DownloadableItemInfo,
> extends Omit<RowWrapperCellChildProps<CellDataT, ItemDataT>, 'children'>,
    Omit<TableDownloadMenuProps<ItemDataT>, 'user' | 'itemInfoGetter' | 'caption'> {
  userGetter: (rowData: ItemDataT) => UI.DownloadSource;
  clickHandlerGetter?: FileDownloadCellClickHandler;
}

export const FileDownloadCell = <
  CellDataT extends React.ReactNode,
  ItemDataT extends UI.DownloadableItemInfo & FileItemBase,
>({
  cellData,
  rowDataGetter,
  clickHandlerGetter,
  userGetter,
  downloadHandler,
  ...props
}: FileDownloadCellProps<CellDataT, ItemDataT>) => (
  <TableDownloadMenu
    caption={
      <FormattedFile
        typeInfo={rowDataGetter!().type}
        onClick={clickHandlerGetter ? clickHandlerGetter(cellData, rowDataGetter!) : null}
        caption={cellData}
        className="icon-caption"
      />
    }
    user={userGetter(rowDataGetter!())}
    linkCaption={!!clickHandlerGetter ? false : true}
    itemInfoGetter={rowDataGetter!}
    downloadHandler={downloadHandler}
    {...props}
  />
);

/*FileDownloadCell.propTypes = {
  rowDataGetter: PropTypes.func, // REQUIRED
  cellData: PropTypes.any, // REQUIRED
  userGetter: PropTypes.func.isRequired,
  clickHandlerGetter: PropTypes.func,
  downloadHandler: PropTypes.func.isRequired,
};*/

// eslint-disable-next-line max-len
export interface CheckboxCellProps
  extends Omit<RowWrapperCellChildProps<boolean, any>, 'onChange'>,
    Omit<CheckboxProps, 'onChange' | 'checked'> {
  onChange: (checked: boolean, rowData: any) => void;
}

export const CheckboxCell: React.FC<CheckboxCellProps> = ({
  cellData,
  rowDataGetter,
  onChange,
  ...props
}) => (
  <Checkbox
    checked={cellData!}
    onChange={(checked) => onChange(checked, rowDataGetter!())}
    {...props}
  />
);

/*CheckboxCell.propTypes = {
  rowDataGetter: PropTypes.func, // REQUIRED
  cellData: PropTypes.bool, // REQUIRED
  onChange: PropTypes.func.isRequired,
};*/
