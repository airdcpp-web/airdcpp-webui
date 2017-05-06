import React from 'react';

import FileBrowserLayout from 'components/filebrowser/FileBrowserLayout';
import FilesystemConstants from 'constants/FilesystemConstants';

import LoginStore from 'stores/LoginStore';


const DownloadFileBrowser = React.createClass({
	handleDownload(path) {
		this.refs.modal.hide();
	},

	onDirectoryChanged(path) {
		this.setState({ currentPath: path });
	},

	getInitialState() {
		return {
			currentPath: this.getInitialPath(),
		};
	},

	selectedNameFormatter(caption, token) {
		if (token.length === 0) {
			// Drive listing on Windows isn't a good target
			return caption;
		}

		const formatedCaption = (
			<div className="download-handler" onClick={ () => this.props.downloadHandler(this.state.currentPath) }>
				<i className="green download link icon"/>
				<a>{ caption }</a>
			</div>
		);

		return formatedCaption;
	},

	itemIconGetter({ name, type }) {
		if (type.id === 'file') {
			return null;
		}

		const separator = LoginStore.systemInfo.path_separator;
		return (
			<i 
				className="green download link icon"
				onClick={ () => this.props.downloadHandler(this.state.currentPath + name + separator) }
			/>
		);
	},

	getInitialPath() {
		const { history } = this.props;
		return history.length > 0 ? history[history.length-1] : '';
	},

	render() {
		return (
			<FileBrowserLayout 
				initialPath={ this.getInitialPath() } 
				selectedNameFormatter={ this.selectedNameFormatter }
				onDirectoryChanged={ this.onDirectoryChanged }
				historyId={ FilesystemConstants.LOCATION_DOWNLOAD }
				itemIconGetter={ this.itemIconGetter }
			/>
		);
	}
});

export default DownloadFileBrowser;