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

const ListBrowser = React.createClass({
  displayName: "ListBrowser",
  handleClose() {
    //FilelistActions.removeSession(this.props.item.id);
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
    FilelistActions.changeDirectory(this.props.item.user.cid, path);
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