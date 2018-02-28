import PropTypes from 'prop-types';
import React from 'react';

import TableActions from 'actions/TableActions';

import TableFooter from './TableFooter';
import TableContainer from './TableContainer';
import RowDataLoader from './RowDataLoader';

import './style.css';
import 'fixed-data-table-2/dist/fixed-data-table.css';


class VirtualTable extends React.Component {
  static propTypes = {
    /**
		 * Elements to append to the table footer
		 */
    footerData: PropTypes.node,

    /**
		 * Returns a node to render if there are no rows to display
		 */
    emptyRowsNodeGetter: PropTypes.func,

    /**
		 * Possible ID of the current view (items will be cleared when the ID changes)
		 */
    viewId: PropTypes.any,

    /**
		 * Store containing sessions (must be provided together with entityId)
		 */
    sessionStore: PropTypes.object,

    /**
		 * Custom filter that will be displayed in addition to regular text filter
		 */
    customFilter: PropTypes.node,

    /**
		 * Filter that is always applied for source items (those will never be displayed or included in the total count)
		 */
    sourceFilter: PropTypes.object,
  };

  componentWillMount() {
    this._dataLoader = new RowDataLoader(this.props.store, () => this.forceUpdate() );

    this.start(this.props.entityId);
  }

  componentDidMount() {
    this.unsubscribe = this.props.store.listen(this._dataLoader.onItemsUpdated.bind(this._dataLoader));
  }

  componentWillUnmount() {
    this.close();
    this.unsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entityId !== this.props.entityId) {
      this.close();

      this.start(nextProps.entityId);
    }

    if (nextProps.viewId != this.props.viewId) {
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
  };

  start = (entityId) => {
    const { store, sourceFilter } = this.props;

    console.log(`Calling start action for view ${store.viewUrl} (before timeout)`);
    setTimeout(() => {
      console.log(`Calling start action for view ${store.viewUrl} (inside timeout)`);
      TableActions.init(store.viewUrl, entityId, sourceFilter);
      TableActions.setSort(store.viewUrl, store.sortProperty, store.sortAscending);
    });
  };

  close = () => {
    // Don't send the close command if the session was removed
    TableActions.close(this.props.store.viewUrl, this.moduleExists());
  };

  render() {
    const { footerData, emptyRowsNodeGetter, ...other } = this.props;

    if (emptyRowsNodeGetter && this.props.store.totalCount === -1) {
      // Row count is unknown, don't flash the table
      return <div className="virtual-table"/>;
    }

    if (emptyRowsNodeGetter && this.props.store.totalCount === 0) {
      return emptyRowsNodeGetter();
    }

    //console.log('Render virtual table');
    return (
      <div className="virtual-table">
        <TableContainer 
          { ...other }
          dataLoader={this._dataLoader}
        />

        <TableFooter
          store={ this.props.store }
          customFilter={ this.props.customFilter }
          footerData={ footerData }
        />
      </div>
    );
  }
}

export default VirtualTable;
