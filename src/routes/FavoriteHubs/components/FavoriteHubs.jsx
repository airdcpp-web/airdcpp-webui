import React from 'react';

import FavoriteHubActions from '../../../actions/FavoriteHubActions.js'
import { StateEnum } from '../../../constants/FavoriteHubConstants.js'
import FavoriteHubStore from '../../../stores/FavoriteHubStore.js';

import VirtualTable from '../../../components/table/VirtualTable'
import SocketService from '../../../services/SocketService.js'
import ActionMenu from '../../../components/ActionMenu'

import ChildModalMixin from '../../../mixins/ChildModalMixin'

import { Column } from 'fixed-data-table';
import classNames from 'classnames';
import Formatter from '../../../utils/Format.js';
import Checkbox from '../../../components/semantic/Checkbox'

import { Icon, Button } from 'react-semantify'

export default React.createClass({
  mixins: [ChildModalMixin],
  _renderName(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return cellData;
    }

    return <ActionMenu caption={ cellData } actions={ FavoriteHubActions } ids={[ "edit", "remove" ]} itemData={ rowData }/>;
  },

  _renderConnect(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return cellData;
    }

    switch(cellData) {
      case StateEnum.STATE_CONNECTING:
        return (
          <div>
            <a><Icon className="large yellow remove" onClick={ () => FavoriteHubActions.disconnect(rowData) }/></a>
          </div>
          );
      case StateEnum.STATE_CONNECTED:
        return (
          <div>
            <a><Icon className="large grey remove" onClick={ () => FavoriteHubActions.disconnect(rowData) }/></a>
          </div>
          );
      case StateEnum.STATE_DISCONNECTED:
        return (
          <div>
            <a><Icon className="large green video play" onClick={ () => FavoriteHubActions.connect(rowData) }/></a>
          </div>
          );
    }
  },

  _rowClassNameGetter(rowData) {
    switch(rowData.connect_state) {
      case StateEnum.STATE_CONNECTING:
        return "connecting"
      case StateEnum.STATE_CONNECTED:
        return "connected"
      case StateEnum.STATE_DISCONNECTED:
        return "disconnected" 
    }
  },

  _renderAutoConnect(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return cellData;
    }

    return <Checkbox checked={cellData} onChange={ checked => FavoriteHubActions.update(rowData, { auto_connect: checked }) }/>;
  },

  _handleAddHub() {
    FavoriteHubActions.create();
  },

  render() {
    let footerData = (
      <Button className="small" onClick={ this._handleAddHub }>
        <i className="plus icon"></i>
        Add new
      </Button>);

    return (
      <VirtualTable
        rowClassNameGetter={ this._rowClassNameGetter }
      	defaultSortProperty="name"
        footerData={footerData}
        store={ FavoriteHubStore }>
        <Column
          label="Connect"
          width={70}
          dataKey="connect_state"
          cellRenderer={ this._renderConnect }
        />
        <Column
          label="Name"
          width={270}
          dataKey="name"
          flexGrow={3}
          cellRenderer={ this._renderName }
        />
        <Column
          label="Address"
          width={270}
          dataKey="hub_url"
          flexGrow={2}
        />
        <Column
          label="Hub description"
          width={270}
          dataKey="hub_description"
          flexGrow={3}
        />
        <Column
          label="Auto connect"
          width={70}
          dataKey="auto_connect"
          cellRenderer={ this._renderAutoConnect }
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
