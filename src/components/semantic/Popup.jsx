import React from 'react';
import ReactDOM from 'react-dom';

import CSSPropertyOperations from 'react/lib/CSSPropertyOperations';

const Popup = React.createClass({
	propTypes: {

		/**
		 * Additional settings for the Semantic UI popup
		 */
		settings: React.PropTypes.object,

		/**
		 * Element that will trigger the popup when clicking on it
		 */
		trigger: React.PropTypes.element.isRequired
	},

	createPortal: function () {
		// Create portal
		this.node = document.createElement('div');

		let className = 'ui flowing popup ';
		if (this.props.className) {
			className += this.props.className;
		}

		this.node.className = className;

		if (this.props.style) {
			CSSPropertyOperations.setValueForStyles(this.node, this.props.style);
		}
		document.body.appendChild(this.node);
	},

	hide: function () {
		if (!this.node) {
			// onHidden called when the popup was removed manually
			return;
		}

		let button = this.refs.overlayTrigger;
		$(button).popup('destroy');

		ReactDOM.unmountComponentAtNode(this.node);
		document.body.removeChild(this.node);
		this.node = null;
	},

	show: function () {
		if (this.node) {
			return;
		}

		this.createPortal();

		ReactDOM.render(this.props.children, this.node);

		// Trigger
		let button = this.refs.overlayTrigger;
		const parentRect = button.parentElement.getBoundingClientRect();
		const pixelsFromBottom = window.innerHeight - parentRect.bottom;

		// Common settings
		let settings = {
			on:'click',
			movePopup:false,
			popup:this.node,
			onHidden: () => this.hide()
		};

		// Component settings
		if (this.props.settings) {
			Object.assign(settings, this.props.settings);
		}

		if (settings['position'].indexOf('bottom') >= 0 && pixelsFromBottom < 350 && pixelsFromBottom < parentRect.top) {
			// Random value and hope that there are no popups larger than this
			// The popup could be rendered before determining but don"t go there yet (and hope that the table is being improved before it"s needed)
			settings['position'] = 'top left';
		}

		if (settings['position'].indexOf('top') >= 0) {
			settings['distanceAway'] = parentRect.top + pixelsFromBottom;
		}

		$(button).popup(settings).popup('show');
	},

	handleClick: function (el) {
		this.show();
	},

	render: function () {
		this.trigger = React.cloneElement(this.props.trigger, { ref: 'overlayTrigger', onClick: this.handleClick });
		return (<div>
			{this.trigger}
		</div>);
	}
});

export default Popup;