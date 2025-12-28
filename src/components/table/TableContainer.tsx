import * as React from 'react';

import { Table, ColumnProps, Plugins } from 'fixed-data-table-2';

import { usingMobileLayout } from '@/utils/BrowserUtils';

import RowWrapperCell from '@/components/table/RowWrapperCell';
import { TextCell, HeaderCell } from '@/components/table/Cell';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { textToI18nKey, toArray } from '@/utils/TranslationUtils';
import { useTableViewManager } from './effects/useTableViewManager';
import { useTranslation } from 'react-i18next';

export type RowClassNameGetter = (rowData: any) => string;

export interface TableContainerProps {
  // ID of the current entity for non-singleton sources
  entityId: API.IdType | undefined;

  // Append class names to row (takes row data as param)
  rowClassNameGetter: RowClassNameGetter | undefined;

  // Store implementing ViewStoreMixin that contains the items
  store: any;

  dataLoader: any;

  moduleId: string | string[];

  // Possible ID of the current view (items will be cleared when the ID changes)
  viewId: number | string | undefined;

  children: React.ReactNode;
}

const formatColumnName = (
  column: React.ReactElement<ColumnProps>,
  store: any,
  moduleId: string | string[],
  t: UI.TranslateF,
) => {
  const { name, columnKey } = column.props;
  let displayName = t(
    textToI18nKey(columnKey as string, [...toArray(moduleId), UI.SubNamespaces.TABLE]),
    name,
  );

  {
    const sortDirArrow = store.sortAscending ? ' ↑' : ' ↓';
    displayName += store.sortProperty === columnKey ? sortDirArrow : '';
  }

  return displayName;
};

const TableContainer: React.FC<TableContainerProps> = (props) => {
  const viewManager = useTableViewManager(props);
  const { t } = useTranslation();

  const childToColumn = (column: React.ReactElement<ColumnProps>) => {
    if (
      !!column.props.hideWidth &&
      viewManager.bounds.width > 0 &&
      column.props.hideWidth > viewManager.bounds.width
    ) {
      return null;
    }

    let { flexGrow, width } = column.props;
    const { cell, columnKey, renderCondition, header: customHeader } = column.props;
    const { store, rowClassNameGetter, moduleId, dataLoader } = props;

    const mobileView = usingMobileLayout();
    if (!mobileView) {
      // Get column width
      if (!!columnKey && !!viewManager.columnWidths[columnKey]) {
        width = viewManager.columnWidths[columnKey];
        flexGrow = undefined;
      }
    }

    // Use custom header if provided (e.g., for selection checkbox column)
    // Otherwise use the default sortable header
    const isSelectionColumn = columnKey === '__selection';
    const header = customHeader ? (
      customHeader
    ) : (
      <Plugins.ResizeCell onColumnResizeEnd={viewManager.onColumnResizeEndCallback}>
        <HeaderCell
          onClick={viewManager.onColumnClicked.bind(null, columnKey)}
          label={formatColumnName(column, store, moduleId, t)}
        />
      </Plugins.ResizeCell>
    );

    return React.cloneElement(column, {
      header,
      flexGrow,
      width,
      isResizable: !mobileView && !isSelectionColumn,
      allowCellsRecycling: true,
      cell: (
        <RowWrapperCell
          dataLoader={dataLoader}
          renderCondition={renderCondition}
          rowClassNameGetter={rowClassNameGetter}
          t={t}
        >
          {cell ? (cell as React.ReactElement<any>) : <TextCell />}
        </RowWrapperCell>
      ),
    });
  };

  // Update and insert generic columns props
  const children = React.Children.map(props.children, childToColumn);

  const { width, height } = viewManager.bounds;
  const { store } = props;
  return (
    <div ref={viewManager.measureRef} className="table-container-wrapper">
      <Table
        width={width}
        height={height}
        rowHeight={50}
        rowsCount={store.rowCount}
        headerHeight={50}
        touchScrollEnabled={true}
        onScrollStart={viewManager.onScrollStart}
        onScrollEnd={viewManager.onScrollEnd}
        scrollTop={viewManager.getScrollTop()}
      >
        {children}
      </Table>
    </div>
  );
};

export default TableContainer;
