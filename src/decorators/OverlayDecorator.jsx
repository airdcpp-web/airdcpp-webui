'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import { Lifecycle } from 'react-router';
import History from 'utils/History';

import '../style.css';

export default function (Component, semanticModuleName) {
	const OverlayDecorator = React.createClass({
		displayName: 'OverlayDecorator',
		mixins: [ Lifecycle ],

		changeHistoryState: true,
		routerWillLeave(nextLocation) {
			// Possibly a router bug....
			if (nextLocation.pathname !== this.props.location.pathname) {
				this.changeHistoryState = false;
				this.hide();
			}
		},

		propTypes: {
			/**
			 * Removes portal from DOM
			 */
			onHidden: React.PropTypes.func,

			/**
			 * Returns to the location that was active before opening the overlay
			 */
			onHide: React.PropTypes.func
		},

		/*replaceState() {
			const { returnTo } = props.location.state[overlayId];
			console.assert(returnTo, 'Return address missing when closing an overlay');
			delete props.location.state[overlayId];
			History.replaceState(props.location.state, returnTo);
		},*/

		showOverlay(componentSettings = {}) {
			const settings = Object.assign(componentSettings, {
				onHidden: this.onHidden,
				onHide: this.onHide,
			});

			let dom = ReactDOM.findDOMNode(this);
			$(dom)[semanticModuleName](settings)[semanticModuleName]('show');
		},

		hide() {
			let dom = ReactDOM.findDOMNode(this);
			$(dom)[semanticModuleName]('hide');
		},

		onHide() {
			if (this.props.onHide) {
				this.props.onHide();
			}
		},

		onHidden() {
			if (this.changeHistoryState) {
				const { state } = this.props.location;
				const { returnTo } = state[this.props.overlayId];
				console.assert(returnTo, 'Return address missing when closing an overlay');
				delete state[this.props.overlayId];
				History.replaceState(state, returnTo);
			}

			if (this.props.onHidden) {
				this.props.onHidden(this.changeHistoryState);
			}
		},

		render() {
			return <Component {...this.props} {...this.state} showOverlay={this.showOverlay} hide={this.hide}/>;
		}
	});

	return OverlayDecorator;
}
