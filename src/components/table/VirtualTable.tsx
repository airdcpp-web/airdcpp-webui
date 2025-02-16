import * as React from 'react';

import TableActions from 'actions/TableActions';

import TableFooter, { TableFooterProps } from './TableFooter';
import TableContainer, { TableContainerProps } from './TableContainer';
import RowDataLoader from './RowDataLoader';

import './style.css';
import 'fixed-data-table-2/dist/fixed-data-table.css';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { Translation } from 'react-i18next';

declare module 'fixed-data-table-2' {
  export interface ColumnProps {
    name: string;
    hideWidth?: number;
    renderCondition?: (cellData: any, rowData: any) => boolean;
  }
}

export type VirtualTableProps = Omit<TableFooterProps, 't'> &
  Omit<TableContainerProps, 'store' | 'dataLoader' | 't'> &
  React.PropsWithChildren<{
    store: any;

    // Store containing sessions (must be provided together with entityId)
    sessionStore?: UI.SessionSlice<UI.SessionType>;

    // Filter that is always applied for source items (those will never be displayed or included in the total count)
    sourceFilter?: API.TableFilter;

    // Returns a node to render if there are no rows to display
    emptyRowsNodeGetter?: () => React.ReactNode;
  }>;

class VirtualTable extends React.PureComponent<VirtualTableProps> {
  dataLoader = new RowDataLoader(this.props.store, () => this.forceUpdate());
  unsubscribe = this.props.store.listen(
    this.dataLoader.onItemsUpdated.bind(this.dataLoader),
  );

  componentDidMount() {
    this.start(this.props.entityId);
  }

  componentWillUnmount() {
    this.close(this.props.entityId);
    this.unsubscribe();
  }

  componentDidUpdate(prevProps: VirtualTableProps) {
    if (prevProps.entityId !== this.props.entityId) {
      this.close(prevProps.entityId);
      this.start(this.props.entityId);
    }

    if (prevProps.viewId !== this.props.viewId) {
      const { store } = this.props;
      if (store.paused) {
        // We need to receive the new items
        TableActions.pause(store.viewUrl, false);
      }

      TableActions.clear(store.viewUrl);
    }
  }

  moduleExists = (entityId: API.IdType | undefined) => {
    if (!entityId || !this.props.sessionStore) {
      return true;
    }

    return this.props.sessionStore.getSession(entityId);
  };

  start = (entityId: API.IdType | undefined) => {
    const { store, sourceFilter } = this.props;

    TableActions.init(store.viewUrl, entityId, sourceFilter);
    TableActions.setSort(store.viewUrl, store.sortProperty, store.sortAscending);
  };

  close = (entityId: API.IdType | undefined) => {
    // Don't send the close command if the session was removed
    TableActions.close(this.props.store.viewUrl, this.moduleExists(entityId));
  };

  render() {
    const {
      store,
      footerData,
      emptyRowsNodeGetter,
      customFilter,
      textFilterProps,
      ...other
    } = this.props;

    if (emptyRowsNodeGetter && store.totalCount === -1) {
      // Row count is unknown, don't flash the table
      return <div className="virtual-table" />;
    }

    if (emptyRowsNodeGetter && store.totalCount === 0) {
      return emptyRowsNodeGetter();
    }

    //console.log('Render virtual table');
    return (
      <div className="virtual-table">
        <Translation>
          {(t) => (
            <>
              <TableContainer
                {...other}
                dataLoader={this.dataLoader}
                store={store}
                t={t}
              />

              <TableFooter
                store={store}
                customFilter={customFilter}
                footerData={footerData}
                textFilterProps={textFilterProps}
              />
            </>
          )}
        </Translation>
      </div>
    );
  }
}

export default VirtualTable;
