import React from 'react';
import { Column } from 'fixed-data-table';
import classNames from 'classnames';

import { PriorityEnum, StatusEnum } from '../../../constants/QueueConstants';
import ActionMenu from '../../../components/ActionMenu'
import QueueStore from '../../../stores/QueueStore';
import QueueActions from '../../../actions/QueueActions';
import VirtualTable from '../../../components/table/VirtualTable'
import ChildModalMixin from '../../../mixins/ChildModalMixin'

import Formatter from '../../../utils/Format';
import { Dropdown, Icon, Item } from 'react-semantify'
import TableDropdown, { DropdownItem } from '../../../components/semantic/TableDropdown'

export default React.createClass({
  mixins: [ChildModalMixin],

  rowGetter(rowIndex) {
    return this.state.bundles[Object.keys(this.state.bundles)[rowIndex]];
  },

  renderStatus(cellData, cellDataKey, rowData) {
    if (cellData === undefined) {
      return cellData;
    }

    const Progress = React.createClass({
      render: function() {
        const cNames = classNames(
          "ui", 
          "progress", 
          { "grey": cellData.id == StatusEnum.STATUS_QUEUED && rowData.speed == 0 },
          { "blue": cellData.id == StatusEnum.STATUS_QUEUED && rowData.speed > 0 },
          { "success": cellData.id >= StatusEnum.STATUS_FINISHED },
          { "error": cellData.id == StatusEnum.STATUS_FAILED_MISSING || cellData.id == StatusEnum.STATUS_SHARING_FAILED || cellData.id == StatusEnum.STATUS_HASH_FAILED }
        );

        const percent = (rowData.downloaded_bytes*100) / rowData.size;
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

    if (rowData.status.id >= StatusEnum.STATUS_FINISHED) {
      return ''
    }

    const PriorityListItem = React.createClass({
      handleClick: function() {
        QueueActions.setBundlePriority(this.props.item.id, this.props.priority.id);
      },

      render: function() {
        return (
          <DropdownItem active={this.props.item.priority.id === this.props.priority.id } onClick={ this.handleClick }>{ this.props.priority.str }</DropdownItem>
        );
      }
    });

    const PriorityCell = React.createClass({
      render: function() {
        let self = this;
        const trigger = (<div>
          { this.props.itemPrio.str }
          <i className="dropdown icon"></i>
        </div>);

        return (
          <TableDropdown caption={ this.props.itemPrio.str }>
              {Object.keys(PriorityEnum.properties).map((prioKey) => {
                return <PriorityListItem key={ prioKey } priority={ PriorityEnum.properties[prioKey] } {...self.props}/>;
              })}
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

    if (rowData.status.id >= StatusEnum.STATUS_DOWNLOADED) {
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

    const formatter = (
      <Formatter.FileNameFormatter type={ rowData.type.type }>
        { cellData }
      </Formatter.FileNameFormatter>);
    return <ActionMenu caption={ formatter } actions={ QueueActions } ids={[ "searchBundle", "removeBundle" ]} itemData={ rowData }/>;
  },

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
