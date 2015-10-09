import React from 'react';
import Modal from './semantic/Modal'

import { FILESYSTEM_LIST_URL, FILESYSTEM_DIRECTORY_URL } from 'constants/FilesystemConstants'

import LoginStore from 'stores/LoginStore'
import SocketService from 'services/SocketService'
import Formatter from 'utils/Format';

const PathItem = React.createClass({
  render: function() {
    const { item } = this.props;
    return (
      <tr>
        <td>
          <Formatter.FileNameFormatter item={ item.type }>
            <a onClick={evt => this.props.itemClickHandler(item.name)}>
              {item.name}
            </a>
            {this.props.itemIcon ? <i className={ this.props.itemIcon + " link icon" } onClick={ () => this.props.iconClickHandler(item.name) }></i> : null}
          </Formatter.FileNameFormatter>
        </td>
        <td>
          { Formatter.formatSize(item.size) }
        </td>
      </tr>
    );
  }
});

const PathList = React.createClass({
  propTypes: {
    /**
     * Function handling the path selection. Receives the selected path as argument.
     */
    itemClickHandler: React.PropTypes.func.isRequired,

    /**
     * Function handling the path selection. Receives the selected path as argument.
     */
    iconClickHandler: React.PropTypes.func,

    /**
     * Array of path objects to list
     */
    items: React.PropTypes.array.isRequired,
  },

  sort(a, b) {
    if (a.type.id !== b.type.id && (a.type.id === "directory" || b.type.id === "directory")) {
      return a.type.id === "directory" ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  },

  render: function() {
    return (
      <div className="table-container">
        <table className="ui striped compact table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            { this.props.items.sort(this.sort).map(item => <PathItem item={item} itemIcon={this.props.itemIcon} iconClickHandler={ this.props.iconClickHandler } itemClickHandler={ this.props.itemClickHandler }/>) }
          </tbody>
        </table>
      </div>
    );
  }
});

const Breadcrumb = React.createClass({
  propTypes: {
    /**
     * Function handling the path selection. Receives the selected path as argument.
     */
    itemClickHandler: React.PropTypes.func.isRequired,

    /**
     * Function handling the path selection. Receives the selected path as argument.
     */
    rootName: React.PropTypes.string.isRequired,

    /**
     * Root path that will be appended to the beginning of the returned path
     */
    rootPath: React.PropTypes.string.isRequired,

    /**
     * Root path that will be appended to the beginning of the returned path
     */
    separator: React.PropTypes.string.isRequired,

    /**
     * Array of path objects to list
     */
    tokens: React.PropTypes.array.isRequired,
  },

  onClick(token, index) {
    let path = this.props.rootPath;
    for (let i = 0; i <= index; i++) {
        if (path.length === 0) {
          // No separator after the drive on Windows
          path += this.props.tokens[i];
        } else {
          path += this.props.tokens[i] + this.props.separator;
        }
    }

    this.props.itemClickHandler(path);
  },

  render: function() {
    const items = this.props.tokens.map((token, index) => {
      return (
        <div>
          <i className="right chevron icon divider"></i>
          <a className="section" onClick={() => this.onClick(token, index)}>{token}</a>
        </div>)
    });

    return (
      <div className="ui breadcrumb segment">
        <a className="section" onClick={() => this.props.itemClickHandler(this.props.rootPath)}>{this.props.rootName}</a>
        {items}
      </div>
    );
  }
});

export default React.createClass({
  propTypes: {
    /**
     * Initial directory to show
     */
    initialPath: React.PropTypes.string,

    /**
     * Possible additional icon to append after the items
     */
    itemIcon: React.PropTypes.string,

    /**
     * Function to call after clicking the selection icon. Receives the path as param.
     */
    itemIconClickHandler: React.PropTypes.func,

    /**
     * Function to call when changing the directory. Receives the path as param.
     */
    onDirectoryChanged: React.PropTypes.func
  },

  getInitialState() {
    this._pathSeparator = LoginStore.systemInfo.path_separator;
    this._platform = LoginStore.systemInfo.platform;

    return {
      currentDirectory: this.props.initialPath,
      items: null
    }
  },

  getDefaultProps() {
    return {
      initialPath: ""
    }
  },

  fetchItems(path) {
    this.setState({ items: null, currentDirectory: path });
    SocketService.post(FILESYSTEM_LIST_URL, { path: path, directories_only: true })
      .then(data => this.setState({ items: data }))
      .catch(error => console.error("Failed to fetch paths", path, error.message));
  },

  componentDidMount() {
    this.fetchItems(this.state.currentDirectory);
  },

  _tokenizePath() {
    let path = this.state.currentDirectory;
    if (path.length === 0) {
      return [];
    }
    
    let tokens = [];
    if (this._platform == "windows") {
      // Leave the slashes in drive ID intact on Windows
      tokens = [path.substring(0,3)];
      path = path.substring(3);
    }

    return [ tokens, ...path.split(this._pathSeparator)].filter(el => el.length != 0);
  },

  _appendDirectoryName(directoryName) {
    let nextPath = this.state.currentDirectory;
    if (nextPath.length === 0) {
      // No separator after the drive on Windows
      nextPath += directoryName;
    } else {
      nextPath += directoryName + this._pathSeparator;
    }

    return nextPath;
  },

  _handleSelect(directoryName) {
    const nextPath = this._appendDirectoryName(directoryName);

    if (this.props.itemClickHandler) {
      this.props.itemClickHandler(nextPath);
    }

    this.fetchItems(nextPath);
  },

  _onIconClick(directoryName) {
    const nextPath = this._appendDirectoryName(directoryName);
    this.props.itemIconClickHandler(nextPath);
  },

  render: function() {
    if (!this.state.items) {
      return <div className="ui text loader">Loading</div>;
    }

    const rootName = this._platform == "windows" ? "Computer" : "Root";
    return (
      <div className="file-browser">
        <Breadcrumb tokens={this._tokenizePath()} separator={this._pathSeparator} rootPath={""} rootName={rootName} itemClickHandler={this.fetchItems}/>
        <PathList items={ this.state.items } iconClickHandler={ this._onIconClick } itemClickHandler={ this._handleSelect } itemIcon={ this.state.currentDirectory.length === 0 ? null : this.props.itemIcon}/>
      </div>
  )}
});