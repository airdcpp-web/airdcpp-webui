import React from 'react';

import OverlayDecorator from 'decorators/OverlayDecorator';
import { History } from 'react-router';
import classNames from 'classnames';
import LayoutHeader from 'components/semantic/LayoutHeader';

const Modal = React.createClass({
	mixins: [ History ],
	propTypes: {
		/**
		 * Close the modal when clicking outside its boundaries
		 */
		closable: React.PropTypes.bool,

		/**
		 * Function to call when the dialog is approved
		 * If no handler is supplied, there will only be a plain close button
		 */
		onApprove: React.PropTypes.func,

		/**
		 * Caption for the approve button
		 */
		approveCaption: React.PropTypes.node,

		/**
		 * Use disabled style for the approve button
		 */
		approveDisabled: React.PropTypes.bool,
	},

	getDefaultProps() {
		return {
			closable: true,
			approveCaption: 'Save',
			approveEnabled: true,
		};
	},

	getInitialState() {
		return {
			saving: false
		};
	},

	onDeny: function (el) {
	},

	onApprove: function (el) {
		let { onApprove } = this.props;
		if (onApprove) {
			this.setState({ saving: true });
			let promise = onApprove();
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
		const approveStyle = classNames(
			'ui ok green basic button',
			{ 'disabled': this.props.approveDisabled },
			{ 'loading': this.state.saving },
		);

		return (
			<div className={ 'ui modal full ' + this.props.className }>
				<LayoutHeader
					title={ this.props.title }
					icon={ this.props.icon }
					subHeader={ this.props.subHeader }
					size="medium"
				/>
				<div className="content">
					{ this.props.children }
				</div>

				{this.props.onApprove ? (
					<div className="actions">
						<div className={ approveStyle }>
							<i className="checkmark icon"></i>
							{this.props.approveCaption}
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
