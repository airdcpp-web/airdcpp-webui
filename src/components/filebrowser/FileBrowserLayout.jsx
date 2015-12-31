import React from 'react';

import FilesystemConstants from 'constants/FilesystemConstants';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';
import SocketService from 'services/SocketService';

import BrowserBar from 'components/browserbar/BrowserBar';
import Message from 'components/semantic/Message';
import Accordion from 'components/semantic/Accordion';
import ActionInput from 'components/semantic/ActionInput';

import Loader from 'components/semantic/Loader';
import FileItemList from './FileItemList';

import './style.css';


const CreateDirectory = ({ handleAction }) => (
	<Accordion>
		<div className="title create-section">
			<i className="dropdown icon"></i>
			Create directory
		</div>

		<div className="content create-section">
			<ActionInput caption="Create" icon="plus" handleAction={ handleAction } placeholder="Directory name"/>
		</div>
	</Accordion>
);

CreateDirectory.propTypes = {
	/**
	 * Function to call with the value
	 */
	handleAction: React.PropTypes.func.isRequired
};


const FileBrowser = React.createClass({
	propTypes: {
		/**
		 * Initial directory to show
		 */
		initialPath: React.PropTypes.string,

		/**
		 * Function to call when changing the directory. Receives the path as param.
		 */
		onDirectoryChanged: React.PropTypes.func
	},

	getInitialState() {
		this._pathSeparator = LoginStore.systemInfo.path_separator;
		this._isWindows = LoginStore.systemInfo.platform == 'windows';

		return {
			currentDirectory: this.props.initialPath.length === 0 ? this.getRootPath() : this.props.initialPath,
			items: [],
			loading: true,
			error: null
		};
	},

	getDefaultProps() {
		return {
			initialPath: '',
			selectedNameFormatter: (element) => element,
		};
	},

	componentDidUpdate(prevProps, prevState) {
		if (prevState.currentDirectory !== this.state.currentDirectory) {
			if (this.props.onDirectoryChanged) {
				this.props.onDirectoryChanged(this.state.currentDirectory);
			}
		}
	},

	onFetchFailed(error) {
		if (!this.initialFetchCompleted) {
			// The path doesn't exists, go to root
			this.fetchItems(this.getRootPath());
			return;
		}

		this.setState({ 
			error: error.message,
			loading: false
		});
	},

	onFetchSucceed(path, data) {
		this.setState({ 
			currentDirectory: path,
			items: data,
			loading: false
		});

		this.initialFetchCompleted = true;
	},

	fetchItems(path) {
		this.setState({ 
			error: null,
			loading: true
		});

		SocketService.post(FilesystemConstants.LIST_URL, { path: path, directories_only: false })
			.then(this.onFetchSucceed.bind(this, path))
			.catch(this.onFetchFailed);
	},

	componentDidMount() {
		this.fetchItems(this.state.currentDirectory);
	},

	_appendDirectoryName(directoryName) {
		return this.state.currentDirectory + directoryName + this._pathSeparator;
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
		SocketService.post(FilesystemConstants.DIRECTORY_URL, { path: newPath })
			.then(data => this.fetchItems(this.state.currentDirectory))
			.catch(error => this.setState({ 
				error: error.message
			}));
	},

	getRootPath() {
		return this._isWindows ? '' : '/';
	},

	render: function () {
		if (this.state.loading) {
			return <Loader text="Loading items"/>;
		}

		const hasEditAccess = LoginStore.hasAccess(AccessConstants.FILESYSTEM_EDIT);
		const rootName = this._isWindows ? 'Computer' : 'Root';
		return (
			<div className="file-browser">
				{ this.state.error ? (<Message isError={true} title="Failed to load content" description={this.state.error}/>) : null }
				<BrowserBar 
					path={ this.state.currentDirectory }
					separator={ this._pathSeparator } 
					rootPath={ this.getRootPath() } 
					rootName={ rootName } 
					itemClickHandler={ this.fetchItems }
					selectedNameFormatter={ this.props.selectedNameFormatter }
				/>
				<FileItemList 
					items={ this.state.items } 
					itemClickHandler={ this._handleSelect } 
				/>
				{ this.state.currentDirectory && hasEditAccess ? <CreateDirectory handleAction={this._createDirectory}/> : null }
			</div>
	);}
});

export default FileBrowser;
