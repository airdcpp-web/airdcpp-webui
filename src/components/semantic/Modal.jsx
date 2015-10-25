import React from 'react';

import OverlayDecorator from 'decorators/OverlayDecorator';

const Modal = React.createClass({
	displayName: 'Modal',
	propTypes: {

		/**
		 * Title of the modal
		 */
		title: React.PropTypes.node.isRequired,

		/**
		 * Icon to display
		 */
		icon: React.PropTypes.string,

		/**
		 * Close the modal when clicking outside its boundaries
		 */
		closable: React.PropTypes.bool,

		/**
		 * Function to call when the dialog is saved
		 * If no handler is supplied, there will only be a plain close button
		 */
		saveHandler: React.PropTypes.func,

		/**
		 * Removes portal from DOM and redirects previous path
		 * Should usually be passed from ChildModalMixin
		 */
		closeHandler: React.PropTypes.func.isRequired
	},

	getDefaultProps() {
		return {
			closable: true
		};
	},

	getInitialState() {
		settingCallback = this.getOverlaySettings;

		return {
			saving: false
		};
	},

	onDeny: function (el) {
	},

	onApprove: function (el) {
		let { saveHandler } = this.props;
		if (saveHandler) {
			this.setState({ saving: true });
			let promise = saveHandler();
			promise.then(this.props.hide).catch(() => this.setState({ saving: false }));
			return false;
		}
	},

	componentDidMount() {
		this.props.showOverlay({
			movePopup:false,
			onApprove: this.onApprove,
			onDeny: this.onDeny,
			closable: this.props.closable,
			detachable: false,
			allowMultiple: false
		});
	},

	render: function () {
		return (
			<div className={ 'ui modal ' + this.props.className }>
				<div className="header">
					<i className={ this.props.icon + ' icon' }></i>
					{ this.props.title }
				</div>
				<div className="content">
					{ this.props.children }
				</div>

				{this.props.saveHandler ? (
					<div className="actions">
						<div className={ 'ui ok green basic button ' + (this.state.saving ? 'loading' : '') }>
							<i className="checkmark icon"></i>
							Save
						</div>
						<div className="ui cancel red basic button">
							<i className="remove icon"></i>
							Cancel
						</div>
				</div>) : (
					<div className="actions">
						<div className="ui cancel button">
							<i className="remove icon"></i>
							Close
						</div>
					</div>
				)}
			</div>);
	}
});

export default OverlayDecorator(Modal, 'modal');
