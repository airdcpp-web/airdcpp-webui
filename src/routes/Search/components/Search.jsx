import React from 'react';
import SearchStore from '../../../stores/SearchStore.js';
import VirtualTable from '../../../components/table/VirtualTable'
import SocketService from '../../../services/SocketService.js'
import { Column } from 'fixed-data-table';

import classNames from 'classnames';
import Formatter from '../../../utils/Format.js';
//import { Dropdown } from 'react-semantify'

export default React.createClass({
  render() {
    return (
      <VirtualTable
      	defaultSortProperty="relevancy"
        store={ SearchStore }>
        <Column
          label="Name"
          width={270}
          dataKey="name"
        />
        <Column
          label="Size"
          width={100}
          dataKey="size"
          cellRenderer={ Formatter.formatSize }
        />
        <Column
          label="Relevancy"
          width={50}
          dataKey="relevancy"
          //cellRenderer={ this.renderStatus }
        />
        <Column
          label="Connection"
          width={100}
          dataKey="connection"
          cellRenderer={ Formatter.formatConnection }
        />
        <Column
          label="Type"
          width={150}
          dataKey="type"
          //cellRenderer={ this.renderPriority }
        />
        <Column
          label="Users"
          width={100}
          dataKey="users"
          //cellRenderer={ Formatter.formatDateTime }
        />
        <Column
          label="Date"
          width={100}
          dataKey="date"
          cellRenderer={ Formatter.formatDateTime }
        />
        <Column
          label="Slots"
          width={100}
          dataKey="slots"
          //cellRenderer={ Formatter.formatDateTime }
        />
      </VirtualTable>
    );
  }
});
