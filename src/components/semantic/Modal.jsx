import PropTypes from 'prop-types';
import React from 'react';

import OverlayDecorator from 'decorators/OverlayDecorator';
import classNames from 'classnames';
import LayoutHeader from 'components/semantic/LayoutHeader';

import IconConstants from 'constants/IconConstants';

import 'semantic-ui/components/modal';
import 'semantic-ui/components/modal.min.css';


const Modal = React.createClass({
	propTypes: {
		/**
		 * Close the modal when clicking outside its boundaries
		 */
		closable: PropTypes.bool,

		/**
		 * Function to call when the dialog is approved
		 * If no handler is supplied, there will only be a plain close button
		 */
		onApprove: PropTypes.func,

		/**
		 * Caption for the approve button
		 */
		approveCaption: PropTypes.node,

		/**
		 * Use disabled style for the approve button
		 */
		approveDisabled: PropTypes.bool,

		/**
		 * The modal will always use the maximum allowed width when set,
		 * instead of adjusting the height dynamically.
		 * Useful for modals with navigable, varying height content
		 */
		fullHeight: PropTypes.bool,

		dynamicHeight: PropTypes.bool,
	},

	getDefaultProps() {
		return {
			closable: true,
			approveCaption: 'Save',
			approveEnabled: true,
			fullHeight: false,
			dynamicHeight: false,
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

		return true;
	},

	componentDidMount() {
		this.props.showOverlay(this.c, {
			movePopup:false,
			onApprove: this.onApprove,
			onDeny: this.onDeny,
			closable: this.props.closable,
			detachable: false,
			allowMultiple: true,
			observeChanges: this.props.dynamicHeight,
			//debug: true,
			//verbose: true,
			//name: 'Modal',
		});
	},

	render: function () {
		const approveStyle = classNames(
			'ui ok green basic button',
			{ 'disabled': this.props.approveDisabled },
			{ 'loading': this.state.saving },
		);

		const mainClass = classNames(
			'ui modal',
			{ 'full': this.props.fullHeight },
			this.props.className,
		);

		return (
			<div 
				ref={ c => this.c = c }
				className={ mainClass }
			>
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
							<i className={ IconConstants.SAVE + ' icon' }/>
							{this.props.approveCaption}
						</div>
						<div className="ui cancel red basic button">
							<i className="remove icon"/>
							Cancel
						</div>
				</div>) : (
					<div className="actions">
						<div className="ui cancel button">
							<i className="remove icon"/>
							Close
						</div>
					</div>
				)}
			</div>);
	}
});

export default OverlayDecorator(Modal, 'modal');
