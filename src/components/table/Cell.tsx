import * as React from 'react';

import {
  TableActionMenu,
  TableDownloadMenu,
  TableActionMenuProps,
  TableDownloadMenuProps,
} from '@/components/action-menu';
import { useFormatter } from '@/context/FormatterContext';

import FormattedFile from '@/components/format/FormattedFile';
import FormattedIp from '@/components/format/FormattedIp';

import Checkbox, { CheckboxProps } from '@/components/semantic/Checkbox';
import { showAction } from '@/utils/ActionUtils';
import { Cell, CellProps } from 'fixed-data-table-2';
import { RowWrapperCellChildProps } from '@/components/table/RowWrapperCell';

import * as UI from '@/types/ui';
import * as API from '@/types/api';
import { ActionHandlerDecorator } from '@/decorators/ActionHandlerDecorator';
import { useSession } from '@/context/AppStoreContext';
import { formatDecimal } from '@/utils/ValueFormat';
import LinkButton from '@/components/semantic/LinkButton';

const getCellContent = (cellData: any) => {
  if (typeof cellData === 'object') {
    return Array.isArray(cellData) ? cellData.length : cellData.str;
  }

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
    <LinkButton onClick={onClick} caption={label} />
  </Cell>
);

export interface ActionCellProps<
  CellDataT,
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
> extends Omit<RowWrapperCellChildProps<CellDataT, ItemDataT>, 't' | 'children'>,
    Omit<TableActionMenuProps<ItemDataT, EntityT>, 'caption' | 'itemData'> {}

interface FileItemBase {
  type: API.FileItemType;
}

export const FileActionCell = <
  CellDataT extends React.ReactNode,
  ItemDataT extends UI.ActionMenuItemDataValueType & FileItemBase,
  EntityT extends UI.ActionMenuItemEntityValueType,
>({
  cellData,
  rowDataGetter,
  children,
  ...props
}: ActionCellProps<CellDataT, ItemDataT, EntityT>) => (
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
  EntityT extends UI.ActionMenuItemEntityValueType,
>({
  cellData,
  rowDataGetter,
  ...props
}: ActionCellProps<CellDataT, ItemDataT, EntityT>) => (
  <TableActionMenu caption={cellData} itemData={rowDataGetter!} {...props} />
);

export interface ActionLinkCellProps<
  CellDataT,
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
> extends RowWrapperCellChildProps<CellDataT, ItemDataT> {
  /*Pick<ActionButtonProps<ItemDataT>, 'actions' | 'actionId'>*/

  //action: (itemData: any, location: Location) => void;
  //action: UI.ActionType<ItemDataT>;
  action: UI.ActionDefinition<ItemDataT, EntityT>;
  moduleData: UI.ActionModuleData;
  entity?: EntityT;
  // actionId: string;
}

export const ActionLinkCell = <
  CellDataT,
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>(
  {
    cellData,
    rowDataGetter,
    //location,
    //onClickAction, action,
    action,
    moduleData,
    entity,
    ...props
  }: ActionLinkCellProps<
    CellDataT,
    ItemDataT,
    EntityT
  > /*& ActionHandlerDecoratorChildProps*/,
) => {
  const login = useSession();
  if (!showAction(action, rowDataGetter!(), login)) {
    return <TextCell cellData={cellData} {...props} />;
  }

  return (
    <ActionHandlerDecorator<ItemDataT, EntityT>>
      {({ onClickAction }) => (
        <LinkButton
          className="plain link cell"
          onClick={() =>
            onClickAction({
              action,
              moduleData,
              itemData: rowDataGetter!(),
              entity: entity as EntityT,
            })
          }
          caption={getCellContent(cellData)}
        />
      )}
    </ActionHandlerDecorator>
  );
};

export interface NumberCellProps extends RowWrapperCellChildProps<number, any> {
  cellData?: number;
}

export const SizeCell: React.FC<NumberCellProps> = ({ cellData }) => {
  const { formatSize } = useFormatter();
  return <span className="plain size cell">{formatSize(cellData!)}</span>;
};

export const SpeedCell: React.FC<NumberCellProps> = ({ cellData }) => {
  const { formatSpeed } = useFormatter();
  return <span className="plain speed cell">{formatSpeed(cellData!)}</span>;
};

export const DateCell: React.FC<NumberCellProps> = ({ cellData, width }) => {
  const { formatShortDate, formatDateTime } = useFormatter();
  return (
    <span className="plain date cell">
      {!!width && width > 150 ? formatDateTime(cellData!) : formatShortDate(cellData!)}
    </span>
  );
};

export const DurationCell: React.FC<NumberCellProps> = ({ cellData }) => {
  const { formatRelativeTime } = useFormatter();
  return <span className="plain duration cell">{formatRelativeTime(cellData!)}</span>;
};

export const AbbreviatedDurationCell: React.FC<NumberCellProps> = ({ cellData }) => {
  const { formatAbbreviatedDuration } = useFormatter();
  return (
    <span className="plain abbr-duration cell">
      {formatAbbreviatedDuration(cellData!)}
    </span>
  );
};

export interface IpCellProps {
  cellData?: API.IP;
}

export const IpCell: React.FC<IpCellProps> = ({ cellData }) => (
  <FormattedIp item={cellData!} />
);

export const ConnectionCell: React.FC<NumberCellProps> = ({ cellData }) => {
  const { formatConnection } = useFormatter();
  return <span className="plain connection cell">{formatConnection(cellData!)}</span>;
};

export const DecimalCell: React.FC<NumberCellProps> = ({ cellData }) => (
  <span className="plain decimal cell">{formatDecimal(cellData!)}</span>
);

export type FileDownloadCellCaptionGetter = (
  cellData: any,
  rowDataGetter: () => any,
) => React.ReactNode;

export interface FileDownloadCellProps<
  CellDataT,
  ItemDataT extends UI.DownloadableItemInfo,
  EntityT extends UI.SessionItemBase,
> extends Omit<RowWrapperCellChildProps<CellDataT, ItemDataT>, 'children'>,
    Omit<
      TableDownloadMenuProps<ItemDataT, EntityT>,
      'user' | 'itemInfoGetter' | 'caption'
    > {
  userGetter: (rowData: ItemDataT) => UI.DownloadSource;
  captionGetter?: FileDownloadCellCaptionGetter;
}

export const FileDownloadCell = <
  CellDataT extends React.ReactNode,
  ItemDataT extends UI.DownloadableItemInfo & FileItemBase,
  EntityT extends UI.SessionItemBase,
>({
  cellData,
  rowDataGetter,
  captionGetter,
  userGetter,
  downloadHandler,
  ...props
}: FileDownloadCellProps<CellDataT, ItemDataT, EntityT>) => (
  <TableDownloadMenu
    caption={
      <FormattedFile
        typeInfo={rowDataGetter!().type}
        caption={captionGetter ? captionGetter(cellData, rowDataGetter!) : cellData}
        className="icon-caption"
      />
    }
    user={userGetter(rowDataGetter!())}
    linkCaption={!captionGetter}
    itemInfoGetter={rowDataGetter!}
    downloadHandler={downloadHandler}
    {...props}
  />
);

export interface CheckboxCellProps
  extends Omit<RowWrapperCellChildProps<boolean, any>, 'onChange' | 'id'>,
    Omit<CheckboxProps, 'onChange' | 'checked' | 'id'> {
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
