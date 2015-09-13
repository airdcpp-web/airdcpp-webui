import React from 'react';
import FavoriteHubStore from '../../../stores/FavoriteHubStore.js';
import VirtualTable from '../../../components/table/VirtualTable'
import SocketService from '../../../services/SocketService.js'
import { Column } from 'fixed-data-table';

import classNames from 'classnames';
import Formatter from '../../../utils/Format.js';
//import { Dropdown } from 'react-semantify'

export default React.createClass({
  renderName(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return cellData;
    }

    return cellData;
    /*var formatter = (
      <Formatter.FileNameFormatter type={ rowData.type.type }>
        { cellData }
      </Formatter.FileNameFormatter>);
    return <ActionMenu caption={ formatter } actions={ QueueActions } ids={[ "searchBundle", "removeBundle" ]} itemData={ rowData }/>;*/
  },

  render() {
    return (
      <VirtualTable
      	defaultSortProperty="name"
        store={ FavoriteHubStore }>
        <Column
          label="Name"
          width={270}
          dataKey="name"
          flexGrow={3}
          cellRenderer={ this.renderName }
        />
        <Column
          label="Address"
          width={270}
          dataKey="server"
          flexGrow={2}
        />
        <Column
          label="Hub description"
          width={270}
          dataKey="hub_description"
          flexGrow={3}
          //cellRenderer={ this.renderStatus }
        />
        <Column
          label="Connected"
          width={70}
          dataKey="connected"
          cellRenderer={ Formatter.formatBool }
        />
        <Column
          label="Auto connect"
          width={70}
          dataKey="auto_connect"
          cellRenderer={ Formatter.formatBool }
        />
        <Column
          label="Nick"
          width={100}
          dataKey="nick"
          flexGrow={1}
        />
        <Column
          label="Password"
          width={80}
          dataKey="has_password"
          cellRenderer={ Formatter.formatBool }
        />
      </VirtualTable>
    );
  }
});
