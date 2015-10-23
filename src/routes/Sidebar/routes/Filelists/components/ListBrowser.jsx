import React from 'react';
import { Column } from 'fixed-data-table'

import FilelistActions from 'actions/FilelistActions'
import { FILELIST_SESSION_URL } from 'constants/FilelistConstants'

import { DownloadMenu } from 'components/Menu'

import Formatter from 'utils/Format'
import TypeConvert from 'utils/TypeConvert'

import PathBreadcrumb from 'components/PathBreadcrumb'
import VirtualTable from 'components/table/VirtualTable'
import FilelistViewStore from 'stores/FilelistViewStore'
import History from 'utils/History'

const ListBrowser = React.createClass({
  displayName: "ListBrowser",
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

    let captionText = cellData;
    if (rowData.type.id === "directory") {
      captionText = (
        <a onClick={() => this._handleClickDirectory(this.props.item.directory + cellData + '/')}>
          { cellData }
        </a>
        )
    }

    const formatter = (
      <Formatter.FileNameFormatter item={ rowData.type }>
        { captionText }
      </Formatter.FileNameFormatter>);

    return <DownloadMenu 
      caption={ formatter } 
      linkCaption={ false }
      parentEntity={ this.props.item } 
      itemInfo={ rowData } 
      handler={ FilelistActions.download } 
      location={ this.props.location }/>
  },

  _tokenizePath() {
    let path = this.props.item.directory;
    return path.split('/').filter(el => el.length != 0);
  },

  _rowClassNameGetter(rowData) {
    return TypeConvert.dupeToStringType(rowData.dupe);
  },

  _handleClickDirectory(path) {
    // Handle it through location state data
    History.pushSidebarData(this.props.location, { directory: path });
  },

  componentWillMount() {
    const data = History.getSidebarData(this.props.location);
    if (!data || !data.directory) {
      // We need an initial path for our history
      History.replaceSidebarData(this.props.location, { directory: this.props.item.directory });
    } else if (this.props.item.directory !== data.directory) {
      // Opening an existing list from another directory?
      this.changeDirectory(data.directory);
    }
  },

  componentWillReceiveProps(nextProps) {
    const { directory } = History.getSidebarData(nextProps.location);
    if (directory && nextProps.item.directory !== directory) {
      this.changeDirectory(directory);
    }
  },

  changeDirectory(directory) {
    FilelistActions.changeDirectory(this.props.item.user.cid, directory);
  },

  render() {
    return (
      <div className="filelist-browser">
        <PathBreadcrumb 
          tokens={this._tokenizePath()} 
          separator={'/'} 
          rootPath={'/'} 
          rootName={this.props.item.user.nicks} 
          itemClickHandler={this._handleClickDirectory}/>
        <VirtualTable
          rowClassNameGetter={ this._rowClassNameGetter }
          defaultSortProperty="name"
          store={FilelistViewStore}
          entityId={this.props.item.id}
          defaultSortAscending={true}>
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
          {/*<Column
            label="Type"
            width={100}
            dataKey="type"
            cellRenderer={ this._renderStr }
          />*/}
          <Column
            label="Date"
            width={150}
            dataKey="time"
            cellRenderer={ Formatter.formatDateTime }
          />
        </VirtualTable>
      </div>
    );
  },
});

export default ListBrowser