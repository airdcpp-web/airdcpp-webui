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
			title: 'Browse...'
		};
	},

	getInitialState() {
		return {
			currentPath: null,
		};
	},

	onDirectoryChanged(path) {
		this.path = path;
	},

	onConfirm() {
		this.props.onConfirm(this.path);
		return Promise.resolve();
	},

	render: function () {
		return (
			<Modal
				{...this.props}
				ref="modal" 
				title={this.props.title} 
				saveHandler={this.onConfirm} 
				className="file-browser-dialog" 
				closable={true} 
				icon="orange folder open"
			>
				<div className="">
					<FileBrowserLayout
						initialPath={ "" }
						onDirectoryChanged={this.onDirectoryChanged}
					/>
				</div>
			</Modal>);
	}
});

export default FileBrowserDialog;