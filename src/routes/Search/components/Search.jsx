import React from 'react';
import SearchStore from '../../../stores/SearchStore';
import VirtualTable from '../../../components/table/VirtualTable'
import SocketService from '../../../services/SocketService'
import SearchActions from '../../../actions/SearchActions'

import { HistoryEnum } from '../../../constants/HistoryConstants'
import { SEARCH_QUERY_URL } from '../../../constants/SearchConstants'

import HistoryInput from '../../../components/HistoryInput'
import ChildModalMixin from '../../../mixins/ChildModalMixin'

import classNames from 'classnames';
import { Column } from 'fixed-data-table';

import Formatter from '../../../utils/Format';

const SEARCH_PERIOD = 4000;

export default React.createClass({
  mixins: [ChildModalMixin],
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

  renderStr(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return cellData;
    }

    //if (rowData.type.type !== "directory") {
      return cellData.str;
    //}

    /*return (
      <div>
        <a onClick={this.openModal}>
          { cellData.str }
        </a>
    </div>);*/
  },

  renderName(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return cellData;
    }

    var formatter = (
      <Formatter.FileNameFormatter type={ rowData.type.type }>
        { cellData }
      </Formatter.FileNameFormatter>);

    //return formatter;

    var tmp = SearchActions;
    return <Formatter.DownloadMenu caption={ formatter } id={ rowData.id } handler={ SearchActions.download }/>
    //return <ActionMenu caption={ formatter } actions={ SearchActions } ids={[ "download" ]} itemData={ rowData }/>;
  },

  renderIp(cellData) {
    if (cellData === undefined) {
      return cellData;
    }

    return <Formatter.IpFormatter item={ cellData }/>
  },

  renderUsers(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return cellData;
    }

    return <Formatter.UserFormatter user={ cellData } directory={ rowData.path }/>
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
        	defaultSortProperty="relevancy"
          store={ SearchStore }
          defaultSortAscending={false}>
          <Column
            label="Name"
            width={270}
            dataKey="name"
            cellRenderer={ this.renderName }
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
            cellRenderer={ this.renderStr }
          />
          <Column
            label="Users"
            width={150}
            dataKey="users"
            flexGrow={3}
            cellRenderer={ this.renderUsers }
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
            cellRenderer={ this.renderStr }
          />
          <Column
            label="IP"
            width={70}
            dataKey="ip"
            cellRenderer={ this.renderIp }
            flexGrow={3}
          />
        </VirtualTable>
      </div>
    );
  }
});
