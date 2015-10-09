import React from 'react';
import SearchStore from 'stores/SearchStore';
import VirtualTable from 'components/table/VirtualTable'
import SocketService from 'services/SocketService'
import SearchActions from 'actions/SearchActions'

import { HistoryEnum } from 'constants/HistoryConstants'
import { SEARCH_QUERY_URL } from 'constants/SearchConstants'

import HistoryInput from 'components/HistoryInput'
import OverlayParentDecorator from 'decorators/OverlayParentDecorator'

import classNames from 'classnames';
import { Column } from 'fixed-data-table';

import TypeConvert from 'utils/TypeConvert'
import Formatter from 'utils/Format';
import { DOWNLOAD_MODAL_ID } from 'constants/OverlayConstants'

import { DownloadMenu, UserMenu } from 'components/Menu'

import '../style.css'

const SEARCH_PERIOD = 4000;

const Search = React.createClass({
  _handleSearch(text) {
    console.log("Searching");

    SearchStore.clear();
    clearTimeout(this._searchTimeout);

    SocketService.post(SEARCH_QUERY_URL, { pattern: text })
      .then(data => {
        this.setState({running:true});
        this._searchTimeout = setTimeout(() => this.setState({running:false}), data.queue_time + SEARCH_PERIOD);
      })
      .catch(error => 
        console.error("Failed to post search: " + error)
      );
  },

  getInitialState() {
    return {
      running: false
    }
  },

  _renderStr(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return cellData;
    }

    return cellData.str;
  },

  _renderName(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return cellData;
    }

    const formatter = (
      <Formatter.FileNameFormatter item={ rowData.type }>
        { cellData }
      </Formatter.FileNameFormatter>);

    return <DownloadMenu 
      caption={ formatter } 
      id={ rowData.id } 
      itemInfo={ rowData } 
      handler={ SearchActions.download } 
      location={ this.props.location }/>
  },

  _renderIp(cellData) {
    if (cellData === undefined) {
      return cellData;
    }

    return <Formatter.IpFormatter item={ cellData }/>
  },

  _renderUsers(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return cellData;
    }

    return <UserMenu user={ cellData } directory={ rowData.path } location={this.props.location}/>
  },

  _rowClassNameGetter(rowData) {
    return TypeConvert.dupeToStringType(rowData.dupe);
  },

  render() {
    return (
      <div>
        <div className="search-container">
          <div className="search-area">
            <HistoryInput historyId={HistoryEnum.HISTORY_SEARCH} submitHandler={this._handleSearch} running={this.state.running}/>
          </div>
        </div>
        <VirtualTable
          rowClassNameGetter={ this._rowClassNameGetter }
        	defaultSortProperty="relevancy"
          store={ SearchStore }
          defaultSortAscending={false}>
          <Column
            label="Name"
            width={270}
            dataKey="name"
            cellRenderer={ this._renderName }
            flexGrow={5}
          />
          <Column
            label="Size"
            width={100}
            dataKey="size"
            cellRenderer={ Formatter.formatSize }
          />
          <Column
            label="Relevancy"
            width={80}
            dataKey="relevancy"
            cellRenderer={ Formatter.formatDecimal }
          />
          <Column
            label="Connection"
            width={100}
            dataKey="connection"
            cellRenderer={ Formatter.formatConnection }
          />
          <Column
            label="Type"
            width={100}
            dataKey="type"
            cellRenderer={ this._renderStr }
          />
          <Column
            label="Users"
            width={150}
            dataKey="users"
            flexGrow={3}
            cellRenderer={ this._renderUsers }
          />
          <Column
            label="Date"
            width={150}
            dataKey="time"
            cellRenderer={ Formatter.formatDateTime }
          />
          <Column
            label="Slots"
            width={70}
            dataKey="slots"
            cellRenderer={ this._renderStr }
          />
          <Column
            label="IP"
            width={70}
            dataKey="ip"
            cellRenderer={ this._renderIp }
            flexGrow={3}
          />
        </VirtualTable>
      </div>
    );
  }
});

export default OverlayParentDecorator(Search, DOWNLOAD_MODAL_ID);
