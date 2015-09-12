import React from 'react';
import SearchStore from '../../../stores/SearchStore.js';
import VirtualTable from '../../../components/table/VirtualTable'
import SocketService from '../../../services/SocketService.js'
import FixedDataTable from 'fixed-data-table';

//import FixedDataTable from 'fixed-data-table';
import classNames from 'classnames';
import Formatter from '../../../utils/Format.js';
//import { Dropdown } from 'react-semantify'

var Column = FixedDataTable.Column;

//var init = false;

export default React.createClass({

  /*renderStatus(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return cellData;
    }

    var Progress = React.createClass({
      render: function() {
        var cNames = classNames(
          "ui", 
          "progress", 
          { "grey": cellData.id == 1 && rowData.speed == 0 },
          { "blue": cellData.id == 1 && rowData.speed > 0 },
          { "success": cellData.id >= 7 },
          { "error": cellData.id == 5 || cellData.id == 6 || cellData.id == 9 }
        );

        var percent = (rowData.downloaded_bytes*100) / rowData.size;
        return (
          <div className={ cNames } data-percent= { percent }>
            <div className="bar" style={{transitionDuration: 300 + 'ms'}, { width: percent + '%'}}>
              <div className="progress"></div>
            </div>
            <div className="label">{cellData.str}</div>
          </div>
        );
      }
    });

    return <Progress/>; 
  } 

  renderPriority(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return undefined
    }

    if (rowData.status.id >= 7) {
      return ''
    }

    //console.log("Rendering priority for: " + rowData.name);

    var PriorityEnum = {
      DEFAULT: -1,
      PAUSED_FORCED: 0,
      PAUSED: 1,
      LOWEST: 2,
      LOW: 3,
      NORMAL: 4,
      HIGH: 5,
      HIGHEST: 6,
      properties: {
        0: {str: "Paused (forced)", id: 0},
        1: {str: "Paused", id: 1},
        2: {str: "Lowest", id: 2},
        3: {str: "Low", id: 3},
        4: {str: "Normal", id: 4},
        5: {str: "High", id: 5},
        6: {str: "Highest", id: 6}
      }
    };

    var PriorityListItem = React.createClass({
      render: function() {
        return (
          <div onClick={QueueService.setBundlePriority.bind(this.props.priority.id, this.props.item.token)} className="item">{ this.props.priority.str }</div>
        );
      }
    });

    var PriorityCell = React.createClass({
      render: function() {
        var self = this;
        return (
          <Dropdown className="exampledropdown" init={true}>
            { this.props.itemPrio.str }
            <i className="dropdown icon"></i>
            <div className="menu">
              {Object.keys(PriorityEnum.properties).map((prioKey) => {
                return <PriorityListItem key={ prioKey } priority={ PriorityEnum.properties[prioKey] } {...self.props}/>;
              })}
            </div>
          </Dropdown>
        );
      }
    });

    return <PriorityCell itemPrio={ PriorityEnum.properties[cellData] } item={ rowData }/>;
  }*/

  render() {
    return (
      <VirtualTable
      	defaultSortProperty="relevancy"
        store={ SearchStore }>
        {/*<Column
          label="Movie Title"
          width={270}
          dataKey="title"
        />
        <Column
          label="Rank"
          width={100}
          cellRenderer={this._renderButton}
          dataKey="rank"
        />
        <Column
          label="Year"
          width={80}
          dataKey="year"
        />*/}
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
