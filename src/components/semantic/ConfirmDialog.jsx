import React from 'react';
import ReactDOM from 'react-dom';

import BlueBird from 'bluebird';

const ConfirmDialog = React.createClass({
	propTypes: {

		/**
		 * Title of the modal
		 */
		title: React.PropTypes.node.isRequired,

		/**
		 * Content of the modal
		 */
		text: React.PropTypes.node.isRequired,

		/**
		 * Icon to display
		 */
		icon: React.PropTypes.string
	},

	displayName: 'ConfirmDialog',
	componentDidMount() {
		const settings = {
			movePopup:false,
			onHidden:this.onHidden,
			onApprove: this.onApprove,
			onDeny: this.onDeny,
			closable: false,
			detachable: false,
			allowMultiple: true
		};

		let dom = ReactDOM.findDOMNode(this);
		$(dom).modal(settings).modal('show');
	},

	onDeny: function (el) {
		this.props.resolver.reject();
	},

	onApprove: function (el) {
		this.props.resolver.resolve();
	},

	onHidden() {
		if (this.props.node) {
			React.unmountComponentAtNode(this.props.node);
			document.body.removeChild(this.props.node);
		}
	},

	render: function () {
		return (<div className="ui basic modal confirm-dialog">
			<div className="header">
				{ this.props.title }
			</div>
			<div className="image content">
				<div className="image">
					<i className={ this.props.icon + ' icon'}></i>
				</div>
				<div className="description">
					{ this.props.text }
				</div>
			</div>
			<div className="actions">
				<div className="two fluid ui inverted buttons">
					<div className="ui cancel red basic inverted button">
						<i className="remove icon"></i>
						{ this.props.rejectText }
					</div>
					<div className="ui ok green basic inverted button">
						<i className="checkmark icon"></i>
						{ this.props.acceptText }
					</div>
				</div>
			</div>
		</div>);
	}
});

export default function (title, text, icon, acceptText='Yes', rejectText='No') {
	let resolver = BlueBird.pending();
	let node = document.createElement('div');
	const dialog = <ConfirmDialog node={node} title={title} resolver={ resolver } text={ text } icon={ icon } acceptText={acceptText} rejectText={rejectText}/>;

	document.body.appendChild(node);

	ReactDOM.render(dialog, node);
	return resolver.promise;
}
