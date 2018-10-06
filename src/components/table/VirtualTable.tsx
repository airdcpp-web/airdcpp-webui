import PropTypes from 'prop-types';
import React from 'react';

import TableActions from 'actions/TableActions';

import TableFooter, { TableFooterProps } from './TableFooter';
import TableContainer, { TableContainerProps } from './TableContainer';
import RowDataLoader from './RowDataLoader';

import './style.css';
import 'fixed-data-table-2/dist/fixed-data-table.css';

import * as API from 'types/api';


declare module 'fixed-data-table-2' {
  export interface ColumnProps {
    name: string;
    hideWidth?: number;
    renderCondition?: (cellData: any, rowData: any) => boolean;
  }
}

export interface VirtualTableProps extends TableFooterProps, Omit<TableContainerProps, 'store' | 'dataLoader'> {
  store: any;
  sessionStore?: any;
  viewId?: string;
  sourceFilter?: API.TableFilter;
  emptyRowsNodeGetter?: () => React.ReactNode;
}

class VirtualTable extends React.Component<VirtualTableProps> {
  static propTypes = {
    // Elements to append to the table footer
    footerData: PropTypes.node,

    // Returns a node to render if there are no rows to display
    emptyRowsNodeGetter: PropTypes.func,

    // Possible ID of the current view (items will be cleared when the ID changes)
    viewId: PropTypes.any,

    // Store containing sessions (must be provided together with entityId)
    sessionStore: PropTypes.object,

    // Custom filter that will be displayed in addition to regular text filter
    customFilter: PropTypes.node,

    // Filter that is always applied for source items (those will never be displayed or included in the total count)
    sourceFilter: PropTypes.object,
  };

  dataLoader = new RowDataLoader(this.props.store, () => this.forceUpdate());
  unsubscribe = this.props.store.listen(this.dataLoader.onItemsUpdated.bind(this.dataLoader));

  componentDidMount() {
    //this._dataLoader = new RowDataLoader(this.props.store, () => this.forceUpdate() );

    //this.unsubscribe = this.props.store.listen(this._dataLoader.onItemsUpdated.bind(this._dataLoader));

    this.start(this.props.entityId);
  }

  componentWillUnmount() {
    this.close();
    this.unsubscribe();
  }

  UNSAFE_componentWillReceiveProps(nextProps: VirtualTableProps) {
    if (nextProps.entityId !== this.props.entityId) {
      this.close();

      this.start(nextProps.entityId);
    }

    if (nextProps.viewId !== this.props.viewId) {
      if (this.props.store.paused) {
        // We need to receive the new items
        TableActions.pause(this.props.store.viewUrl, false);
      }

      TableActions.clear(this.props.store.viewUrl);
    }
  }

  moduleExists = () => {
    if (!this.props.entityId) {
      return true;
    }

    return this.props.sessionStore.getSession(this.props.entityId);
  }

  start = (entityId?: API.IdType) => {
    const { store, sourceFilter } = this.props;

    //console.log(`Calling start action for view ${store.viewUrl} (before timeout)`);
    setTimeout(() => {
      //console.log(`Calling start action for view ${store.viewUrl} (inside timeout)`);
      TableActions.init(store.viewUrl, entityId, sourceFilter);
      TableActions.setSort(store.viewUrl, store.sortProperty, store.sortAscending);
    });
  }

  close = () => {
    // Don't send the close command if the session was removed
    TableActions.close(this.props.store.viewUrl, this.moduleExists());
  }

  render() {
    const { store, footerData, emptyRowsNodeGetter, customFilter, textFilterProps, ...other } = this.props;

    if (emptyRowsNodeGetter && store.totalCount === -1) {
      // Row count is unknown, don't flash the table
      return <div className="virtual-table"/>;
    }

    if (emptyRowsNodeGetter && store.totalCount === 0) {
      return emptyRowsNodeGetter();
    }

    //console.log('Render virtual table');
    return (
      <div className="virtual-table">
        <TableContainer 
          { ...other }
          dataLoader={ this.dataLoader }
          store={ store }
        />

        <TableFooter
          store={ store }
          customFilter={ customFilter }
          footerData={ footerData }
          textFilterProps={ textFilterProps }
        />
      </div>
    );
  }
}

export default VirtualTable;
