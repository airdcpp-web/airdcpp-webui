import React from 'react';
import Modal from 'components/semantic/Modal';

import { RouteContext } from 'react-router';
import HistoryContext from 'mixins/HistoryContext';

import FileBrowserLayout from './FileBrowserLayout';


const FileBrowserDialog = React.createClass({
	mixins: [ RouteContext, HistoryContext ],
	propTypes: {
		/**
		 * Function handling the path selection. Receives the selected path as argument.
		 * Required
		 */
		onConfirm: React.PropTypes.func,

		/**
		 * Information about the item to download
		 */
		title: React.PropTypes.node,
	},

	getDefaultProps() {
		return {
			title: 'Browse...',
			initialPath: '',
		};
	},

	getInitialState() {
		return {
			currentPath: this.props.initialPath,
		};
	},

	onDirectoryChanged(path) {
		this.setState({ currentPath: path });
	},

	onConfirm() {
		this.props.onConfirm(this.state.currentPath);
		return Promise.resolve();
	},

	render: function () {
		const { currentPath } = this.state;
		return (
			<Modal
				{...this.props}
				ref="modal" 
				title={this.props.title} 
				onApprove={this.onConfirm} 
				className="file-browser-dialog" 
				closable={true}
				fullHeight={true}
				approveDisabled={ currentPath.length === 0 }
				approveCaption="Select"
				icon="yellow folder open"
			>
				<FileBrowserLayout
					initialPath={ this.props.initialPath }
					onDirectoryChanged={this.onDirectoryChanged}
				/>
			</Modal>);
	}
});

export default FileBrowserDialog;