import * as React from 'react';
import { useTranslation } from 'react-i18next';

import TableFooter, { TableFooterProps } from './TableFooter';
import TableContainer, { TableContainerProps } from './TableContainer';

import './style.css';
import 'fixed-data-table-2/dist/fixed-data-table.css';

// import * as API from '@/types/api';
// import * as UI from '@/types/ui';

import { TableManagerProps, useTableManager } from './effects/useTableManager';
import { useSocket } from '@/context/SocketContext';

declare module 'fixed-data-table-2' {
  export interface ColumnProps {
    name: string;
    hideWidth?: number;
    renderCondition?: (cellData: any, rowData: any) => boolean;
  }
}

export type VirtualTableProps = Omit<TableFooterProps, 't'> &
  Omit<TableContainerProps, 'store' | 'dataLoader' | 't' | 'socket'> &
  TableManagerProps &
  React.PropsWithChildren<{
    // store: any;

    // Store containing sessions (must be provided together with entityId)
    // sessionStore?: UI.SessionSlice<UI.SessionType>;

    // Filter that is always applied for source items (those will never be displayed or included in the total count)
    // sourceFilter?: API.TableFilter;

    // Returns a node to render if there are no rows to display
    emptyRowsNodeGetter?: () => React.ReactNode;
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
    ...other
  }) => {
    const dataLoader = useTableManager({ sessionStore, store, entityId, sourceFilter });
    const { t } = useTranslation();
    const socket = useSocket();

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
          {...other}
          socket={socket}
          dataLoader={dataLoader}
          store={store}
          t={t}
        />

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
