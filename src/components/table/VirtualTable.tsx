import * as React from 'react';

import TableFooter, { TableFooterProps } from './TableFooter';
import TableContainer, {
  RowClassNameGetter,
  TableContainerProps,
} from './TableContainer';

import './style.css';
import 'fixed-data-table-2/dist/fixed-data-table.css';

import * as API from '@/types/api';

import { TableManagerProps, useTableDataManager } from './effects/useTableDataManager';

declare module 'fixed-data-table-2' {
  export interface ColumnProps {
    name: string;
    hideWidth?: number;
    renderCondition?: (cellData: any, rowData: any) => boolean;
  }
}

type EmptyRowsNodeGetter = () => React.ReactNode;

export type VirtualTableProps = Omit<TableFooterProps, 't'> &
  Pick<TableContainerProps, 'moduleId'> &
  TableManagerProps &
  React.PropsWithChildren<{
    // Returns a node to render if there are no rows to display
    emptyRowsNodeGetter?: EmptyRowsNodeGetter;

    entityId?: API.IdType;

    viewId?: number | string;

    rowClassNameGetter?: RowClassNameGetter;
  }>;

const VirtualTable = React.memo<VirtualTableProps>(
  ({
    entityId,
    store,
    emptyRowsNodeGetter,
    customFilter,
    footerData,
    textFilterProps,
    sourceFilter,
    sessionStore,
    moduleId,
    rowClassNameGetter,
    children,
  }) => {
    const dataLoader = useTableDataManager({
      sessionStore,
      store,
      entityId,
      sourceFilter,
    });

    if (emptyRowsNodeGetter && store.totalCount === -1) {
      // Row count is unknown, don't flash the table
      return <div className="virtual-table" />;
    }

    if (emptyRowsNodeGetter && store.totalCount === 0) {
      return emptyRowsNodeGetter();
    }

    return (
      <div className="virtual-table">
        <TableContainer
          rowClassNameGetter={rowClassNameGetter}
          dataLoader={dataLoader}
          store={store}
          moduleId={moduleId}
          viewId={store.viewId}
          entityId={entityId}
        >
          {children}
        </TableContainer>

        <TableFooter
          store={store}
          customFilter={customFilter}
          footerData={footerData}
          textFilterProps={textFilterProps}
        />
      </div>
    );
  },
);

export default VirtualTable;
