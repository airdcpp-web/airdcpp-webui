import React from 'react';

import { FILESYSTEM_LIST_URL, FILESYSTEM_DIRECTORY_URL } from 'constants/FilesystemConstants';

import LoginStore from 'stores/LoginStore';
import SocketService from 'services/SocketService';
import Formatter from 'utils/Format';

import PathBreadcrumb from 'components/PathBreadcrumb';
import Message from 'components/semantic/Message';
import Accordion from 'components/semantic/Accordion';
import ActionInput from 'components/semantic/ActionInput';

import Loader from 'components/semantic/Loader';

import './style.css';

const PathItem = React.createClass({
	render: function () {
		const { item } = this.props;
		return (
			<tr>
				<td>
					<Formatter.FileNameFormatter item={ item.type }>
						<a onClick={evt => this.props.itemClickHandler(item.name)}>
							{item.name}
						</a>
						{this.props.itemIcon ? <i className={ this.props.itemIcon + ' link icon' } onClick={ () => this.props.iconClickHandler(item.name) }></i> : null}
					</Formatter.FileNameFormatter>
				</td>
				{/*<td>
					{ Formatter.formatSize(item.size) }
				</td>*/}
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
		if (a.type.id !== b.type.id && (a.type.id === 'directory' || b.type.id === 'directory')) {
			return a.type.id === 'directory' ? -1 : 1;
		}

		return a.name.localeCompare(b.name);
	},

	render: function () {
		return (
			<div className="table-container">
				<table className="ui striped compact table">
					<thead>
						<tr>
							<th>Name</th>
							{/*<th>Size</th>*/}
						</tr>
					</thead>
					<tbody>
						{ this.props.items.sort(this.sort).map(item => 
							<PathItem 
								key={item.name}
								item={item}
								itemIcon={this.props.itemIcon} 
								iconClickHandler={ this.props.iconClickHandler } 
								itemClickHandler={ this.props.itemClickHandler }
							/>) }
					</tbody>
				</table>
			</div>
		);
	}
});

const CreateDirectory = React.createClass({
	propTypes: {
		/**
		 * Function to call with the value
		 */
		handleAction: React.PropTypes.func.isRequired
	},

	render: function () {
		return (
			<Accordion>
				<div className="title create-section">
					<i className="dropdown icon"></i>
					Create directory
				</div>

				<div className="content create-section">
					<ActionInput caption="Create" icon="plus" handleAction={this.props.handleAction} placeholder="Directory name"/>
				</div>
			</Accordion>
		);
	}
});

const FileBrowser = React.createClass({
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
		this._isWindows = LoginStore.systemInfo.platform == 'windows';

		return {
			currentDirectory: this._convertPath(this.props.initialPath),
			items: [],
			loading: true,
			error: null
		};
	},

	getDefaultProps() {
		return {
			initialPath: ''
		};
	},

	componentDidUpdate(prevProps, prevState) {
		if (prevState.currentDirectory !== this.state.currentDirectory) {
			if (this.props.onDirectoryChanged) {
				this.props.onDirectoryChanged(this.state.currentDirectory);
			}
		}
	},

	fetchItems(path) {
		this.setState({ 
			error: null,
			loading: true
		});

		SocketService.post(FILESYSTEM_LIST_URL, { path: path, directories_only: true })
			.then(data => { 
				this.setState({ 
					currentDirectory: path,
					items: data,
					loading: false
				}); 
			})
			.catch(error => this.setState({ 
				error: error.message,
				loading: false
			}));
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
		if (this._isWindows) {
			// Leave the slashes in drive ID intact on Windows
			tokens = [ path.substring(0,3) ];
			path = path.substring(3);
		}

		return [ tokens, ...path.split(this._pathSeparator) ].filter(el => el.length != 0);
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

		this.fetchItems(nextPath);
	},

	_onIconClick(directoryName) {
		const nextPath = this._appendDirectoryName(directoryName);
		this.props.itemIconClickHandler(nextPath);
	},

	_createDirectory(directoryName) {
		this.setState({ 
			error: null
		});

		const newPath = this.state.currentDirectory + directoryName + this._pathSeparator;
		SocketService.post(FILESYSTEM_DIRECTORY_URL, { path: newPath })
			.then(data => this.fetchItems(this.state.currentDirectory))
			.catch(error => this.setState({ 
				error: error.message
			}));
	},

	_convertPath(path) {
		if (path == '' && !this._isWindows) {
			return '/';
		}

		return path;
	},

	render: function () {
		if (this.state.loading) {
			return <Loader text="Loading items"/>;
		}

		const rootName = this._isWindows ? 'Computer' : 'Root';
		return (
			<div className="file-browser">
				{ this.state.error ? (<Message isError={true} title="Failed to load content" description={this.state.error}/>) : null }
				<PathBreadcrumb tokens={this._tokenizePath()} separator={this._pathSeparator} rootPath={this._convertPath('')} rootName={rootName} itemClickHandler={this.fetchItems}/>
				<PathList items={ this.state.items } iconClickHandler={ this._onIconClick } itemClickHandler={ this._handleSelect } itemIcon={ this.state.currentDirectory.length === 0 ? null : this.props.itemIcon}/>
				{ this.state.currentDirectory ? <CreateDirectory handleAction={this._createDirectory}/> : null }
			</div>
	);}
});

export default FileBrowser;
