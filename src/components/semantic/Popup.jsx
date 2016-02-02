import React from 'react';
import ReactDOM from 'react-dom';

import CSSPropertyOperations from 'react/lib/CSSPropertyOperations';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const Popup = React.createClass({
	mixins: [ PureRenderMixin ],
	propTypes: {

		/**
		 * Additional settings for the Semantic UI popup
		 */
		settings: React.PropTypes.object,

		/**
		 * Element that will trigger the popup when clicking on it
		 */
		trigger: React.PropTypes.node.isRequired,

		/**
		 * Show the popup on hover instead of when clicking the element
		 */
		onHover: React.PropTypes.bool,

		position: React.PropTypes.string,

		triggerClassName: React.PropTypes.string,
	},

	getDefaultProps() {
		return {
			settings: {},
			position: 'bottom left',
			triggerClassName: '',
		};
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

	appendPosition(settings) {
		let { position } = this.props;

		const parentRect = this.refs.overlayTrigger.parentElement.getBoundingClientRect();
		const pixelsFromBottom = window.innerHeight - parentRect.bottom;
		if (position.indexOf('bottom') >= 0 && pixelsFromBottom < 350 && pixelsFromBottom < parentRect.top) {
			// Random value and hope that there are no popups larger than this
			// The popup could be rendered before determining but don"t go there yet (and hope that the table is being improved before it"s needed)
			position = 'top left';
		}  

		if (position.indexOf('top') >= 0) {
			settings['distanceAway'] = parentRect.top + pixelsFromBottom;
		}

		settings['position'] = position;
	},

	show: function () {
		if (this.node) {
			return;
		}

		this.createPortal();
		ReactDOM.render(this.props.children, this.node);

		// Common settings
		let settings = {
			on: this.props.onHover ? 'hover' : 'click',
			movePopup: false,
			popup: this.node,
			onHidden: () => this.hide(),
			...this.props.settings,
		};

		this.appendPosition(settings);

		$(this.refs.overlayTrigger).popup(settings).popup('show');
	},

	handleClick: function (el) {
		this.show();
	},

	render: function () {
		const triggerProps = {
			ref: 'overlayTrigger',
			className: this.props.triggerClassName + ' popup trigger',
		};

		if (this.props.onHover) {
			triggerProps['onMouseEnter'] = this.handleClick;
		} else {
			triggerProps['onClick'] = this.handleClick;
		}

		return (
			<span { ...triggerProps }>
				{ this.props.trigger }
			</span>
		);
	}
});

export default Popup;