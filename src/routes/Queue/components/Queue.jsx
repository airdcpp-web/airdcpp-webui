import React from 'react';
import { Column } from 'fixed-data-table';
import classNames from 'classnames';

import QueueStore from '../../../stores/QueueStore.js';
import QueueActions from '../../../actions/QueueActions.js';
import VirtualTable from '../../../components/table/VirtualTable'

import Formatter from '../../../utils/Format.js';
import { Dropdown, Icon, Item } from 'react-semantify'
import TableDropdown from '../../../components/semantic/TableDropdown'
//import Modal from 'react-modal';

var appElement = document.getElementById('popup-common');

//Modal.setAppElement(appElement);
//Modal.injectCSS();

//var init = false;


/*var modal = (
  <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
      >
        <h2>Hello</h2>
        <button onClick={this.closeModal}>close</button>
        <div>I am a modal</div>
        <form>
          <input />
          <button>tab navigation</button>
          <button>stays</button>
          <button>inside</button>
          <button>the modal</button>
        </form>
      </Modal>
);*/

export default React.createClass({
  _onChange() {
    this.setState(this.getBundlesState());
  },

  getBundlesState() {
    return {
      bundles: QueueStore.bundles
    };
  },

  rowGetter(rowIndex) {
    return this.state.bundles[Object.keys(this.state.bundles)[rowIndex]];
  },



  StatusEnum: {
    STATUS_QUEUED: 1,
    STATUS_RECHECK: 2,
    STATUS_DOWNLOADED: 3, // no queued files
    STATUS_MOVED: 4, // all files moved
    STATUS_FAILED_MISSING: 5,
    STATUS_SHARING_FAILED: 6,
    STATUS_FINISHED: 7, // no missing files, ready for hashing
    STATUS_HASHING: 8,
    STATUS_HASH_FAILED: 9,
    STATUS_HASHED: 10,
    STATUS_SHARED:11
  },

  renderStatus(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return cellData;
    }

    var self = this;
    var Progress = React.createClass({
      render: function() {
        var cNames = classNames(
          "ui", 
          "progress", 
          { "grey": cellData.id == self.StatusEnum.STATUS_QUEUED && rowData.speed == 0 },
          { "blue": cellData.id == self.StatusEnum.STATUS_QUEUED && rowData.speed > 0 },
          { "success": cellData.id >= self.StatusEnum.STATUS_FINISHED },
          { "error": cellData.id == self.StatusEnum.STATUS_FAILED_MISSING || cellData.id == self.StatusEnum.STATUS_SHARING_FAILED || cellData.id == self.StatusEnum.STATUS_HASH_FAILED }
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
  },

  renderPriority(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return undefined
    }

    if (rowData.status.id >= this.StatusEnum.STATUS_FINISHED) {
      return ''
    }

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
      handleClick: function() {
        QueueActions.setBundlePriority(this.props.item.id, this.props.priority.id);
      },

      render: function() {
        return (
          <div onClick={ this.handleClick } className="item"><a>{ this.props.priority.str }</a></div>
        );
      }
    });

    var PriorityCell = React.createClass({
      render: function() {
        var self = this;
        var trigger = (<div>
          { this.props.itemPrio.str }
          <i className="dropdown icon"></i>
        </div>);

        return (
          <TableDropdown caption={ this.props.itemPrio.str }>
            <div className="menu">
              {Object.keys(PriorityEnum.properties).map((prioKey) => {
                return <PriorityListItem key={ prioKey } priority={ PriorityEnum.properties[prioKey] } {...self.props}/>;
              })}
            </div>
          </TableDropdown>
        );
      }
    });

    return <PriorityCell itemPrio={ cellData } item={ rowData }/>;
  },

  getInitialState: function() {
    return { modalIsOpen: false };
  },

  openModal: function() {
    this.setState({modalIsOpen: true});
  },

  closeModal: function() {
    this.setState({modalIsOpen: false});
  },

  renderType(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return cellData;
    }

    if (rowData.type.type !== "directory") {
      return cellData.str;
    }

    return (
      <div>
        <a onClick={this.openModal}>
          { cellData.str }
        </a>
    </div>); 
  },

  renderSources(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return cellData;
    }

    if (rowData.status.id >= this.StatusEnum.STATUS_DOWNLOADED) {
      return '';
    }

    return (<a onClick={this.openModal} className="item">
      { cellData.str }
    </a>); 
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
    //return (
    //  <TableDropdown caption={ formatter }>
    //  </TableDropdown>);
//<Item key="2" onClick={ this.handleSearchBundle.bind(this, rowData.id) }><a>{ 'Search for alternates' }</a></Item>
    /*return (<div>
      <Formatter.FileNameFormatter type={ rowData.type.type }>
      { cellData }
      </Formatter.FileNameFormatter>
      <TableDropdown ="">
      </TableDropdown>
      </div>);*/
  },

  //handleRemoveBundle() {
  //  QueueActions.removeBundle(this.props.item.id, this.props.priority.id);
  //},

  //handleSearchBundle() {
  //  QueueActions.searchBundle(this.props.item.id, this.props.priority.id);
  //},

  render() {
    return (
      <VirtualTable
        defaultSortProperty="name"
        store={ QueueStore }>
        <Column
          label="Name"
          width={270}
          flexGrow={5}
          dataKey="name"
          cellRenderer={ this.renderName }
        />
        <Column
          label="Size"
          width={100}
          dataKey="size"
          cellRenderer={ Formatter.formatSize }
        />
        <Column
          label="Type/content"
          width={100}
          dataKey="type"
          cellRenderer={ this.renderType }
        />
        <Column
          label="Sources"
          width={100}
          dataKey="sources"
          cellRenderer={ this.renderSources }
        />
        <Column
          label="Status"
          width={300}
          flexGrow={3}
          dataKey="status"
          cellRenderer={ this.renderStatus }
        />
        <Column
          label="Speed"
          width={100}
          dataKey="speed"
          cellRenderer={ Formatter.formatSpeedIfRunning.bind(Formatter) }
        />
        <Column
          label="Priority"
          width={150}
          dataKey="priority"
          cellRenderer={ this.renderPriority }
        />
        {/*<Column
          label="Time added"
          width={100}
          dataKey="time_added"
          cellRenderer={ Formatter.formatDateTime }
        />
        <Column
          label="Time finished"
          width={100}
          dataKey="time_finished"
          cellRenderer={ Formatter.formatDateTime }
        />*/}
      </VirtualTable>
    );
  }
});
