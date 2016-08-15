import React from 'react';
import ReactDOM from 'react-dom';
import invariant from 'invariant';

import History from 'utils/History';
import OverlayConstants from 'constants/OverlayConstants';

// DOM nodes of open modals
let modalNodes = {};


// A decorator for handling of modals and sidebar
// This should be used with main layouts that are displayed only when socket is connected
// to avoid issues with modals

const removeNode = (key) => {
	let node = modalNodes[key];
	if (node) {
		ReactDOM.unmountComponentAtNode(node);
		document.body.removeChild(node);
		delete modalNodes[key];
	}
};

const getLastChildren = (currentChild) => {
	if (currentChild.props.children) {
		return getLastChildren(currentChild.props.children);
	}

	return currentChild;
};

const showSidebar = (props) => {
	return props.location.state &&
		props.location.state[OverlayConstants.SIDEBAR_ID];
};

export default function (Component) {
	const ModalHandlerDecorator = React.createClass({
		getOverlay(key, props) {
			const { state } = props.location;
			const modalComponent = getLastChildren(props.children);
			const ret = React.cloneElement(modalComponent, {
				// Pass the location data as props
				// Note: isRequired can't be used in proptypes because the element is cloned
				...state[key].data,

				onHidden: () => {
					removeNode(key);
				},

				overlayId: key,
			});

			return ret;
		},

		createModal(key, props) {
			let node = document.createElement('div');
			modalNodes[key] = node;

			document.body.appendChild(node);

			// Don't use regular render as we want to pass (router) context as well
			ReactDOM.unstable_renderSubtreeIntoContainer(this, this.getOverlay(key, props), node);
		},

		checkModals(props) {
			if (!props.location.state) {
				return false;
			}

			let hasModals = false;

			// Check all modal entries that don't exist in current props
			Object.keys(props.location.state).forEach(key => {
				if (key.indexOf(OverlayConstants.MODAL_PREFIX) === 0) {
					if (!modalNodes[key]) {
						this.createModal(key, props);
					}

					hasModals = true;
				}
			});

			return hasModals;
		},

		componentWillMount() {
			if (showSidebar(this.props) || this.checkModals(this.props)) {
				// We must always have children
				this.previousChildren = <div/>;
			}
		},

		componentWillUnmount() {
			// Connection lost, remove all modals
			Object.keys(modalNodes).forEach(key => {
				History.removeOverlay(this.props.location, key);
			});
		},

		componentWillReceiveProps(nextProps) {
			if (this.checkModals(nextProps) || showSidebar(nextProps)) {
				if (!this.previousChildren) {
					// save the old children (just like animation)
					this.previousChildren = this.props.children;
				}
			} else {
				this.previousChildren = null;
			}
		},

		render() {
			invariant(
				Object.keys(modalNodes).length === 0 || 
				(this.props.location.state && Object.keys(this.props.location.state).some(key => key.indexOf(OverlayConstants.MODAL_PREFIX) === 0)), 
				'There are no modals in the location state but modal nodes exist'
			);

			let sidebar = null;
			if (showSidebar(this.props)) {
				sidebar = React.cloneElement(this.props.children, { 
					overlayId: OverlayConstants.SIDEBAR_ID,
					overlayContext: '.sidebar-context',
				});
			}

			return <Component {...this.props} sidebar={ sidebar } children={ this.previousChildren ? this.previousChildren : this.props.children }/>;
		},
	});

	return ModalHandlerDecorator;
}
