import React from 'react';
import SearchStore from '../../../stores/SearchStore';
import VirtualTable from '../../../components/table/VirtualTable'
import SocketService from '../../../services/SocketService'
import { Column } from 'fixed-data-table';
import { HistoryEnum } from '../../../constants/HistoryConstants'
import { SEARCH_QUERY_URL } from '../../../constants/SearchConstants'
import HistoryInput from '../../../components/HistoryInput'

import classNames from 'classnames';
import Formatter from '../../../utils/Format';
import { Dropdown } from 'react-semantify'
import Autosuggest from 'react-autosuggest'


export default React.createClass({
  _handleSearch(text) {
    console.log("Searching");

    SearchStore.clear();

    SocketService.post(SEARCH_QUERY_URL, { pattern: text })
      .then(data => {
      })
      .catch(error => 
        console.error("Failed to post search: " + error)
      );
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

    return formatter;
    //return <ActionMenu caption={ formatter } actions={ QueueActions } ids={[ "searchBundle", "removeBundle" ]} itemData={ rowData }/>;
  },

  render() {
    return (
      <div>
        <div className="search-container">
          <div className="search-area">
            <HistoryInput historyId={HistoryEnum.HISTORY_SEARCH} submitHandler={this._handleSearch}/>
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
            width={100}
            dataKey="type"
            cellRenderer={ this.renderStr }
          />
          <Column
            label="Users"
            width={150}
            dataKey="users"
            flexGrow={3}
            //cellRenderer={ Formatter.formatDateTime }
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
        </VirtualTable>
      </div>
    );
  }
});
