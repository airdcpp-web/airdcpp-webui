'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import invariant from 'invariant';

import { Lifecycle } from 'react-router';
import History from 'utils/History';

import '../style.css';

export default function (Component, semanticModuleName) {
	const OverlayDecorator = React.createClass({
		mixins: [ Lifecycle ],

		changeHistoryState: true,
		routerWillLeave(nextLocation) {
			if (nextLocation.pathname.indexOf(this.props.location.pathname) !== 0) {
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
			onHide: React.PropTypes.func,

			location: React.PropTypes.object.isRequired,
			overlayId: React.PropTypes.any,
		},

		componentWillReceiveProps(nextProps) {
			if (nextProps.location.state[this.props.overlayId].data.close) {
				this.hide();
			}
		},

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
				invariant(returnTo && this.props.overlayId, 'Return address or overlay id missing when closing an overlay');
				delete state[this.props.overlayId];
				
				//History.replace({
				//	state, 
				//	pathname: returnTo,
				//});

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
