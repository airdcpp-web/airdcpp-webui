import React from 'react';
import ReactDOM from 'react-dom';

let nodes = {};

const removeNode = (key) => {
	let node = nodes[key];
	if (node) {
		ReactDOM.unmountComponentAtNode(node);
		document.body.removeChild(node);
		delete nodes[key];
	}
};

const getLastChildren = (currentChild) => {
	if (currentChild.props.children) {
		return getLastChildren(currentChild.props.children);
	}

	return currentChild;
};

export default function (Component) {
	const ModalHandlerDecorator = React.createClass({
		getOverlay(key, props) {
			const { state } = props.location;
			const modalComponent = getLastChildren(props.children);
			const ret = React.cloneElement(modalComponent, { 
				onHidden: () => {
					removeNode(key);
				},

				overlayId: key,

				// Pass the location data as props
				// Note: isRequired can't be used in proptypes because the element is cloned
				...state[key].data
			});

			return ret;
		},

		createModal(key, props) {
			let node = document.createElement('div');
			nodes[key] = node;

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
				if (key.indexOf('modal_') === 0) {
					if (!this.props.location.state || !this.props.location.state[key]) {
						this.createModal(key, props);
					}

					hasModals = true;
				}
			});

			return hasModals;
		},

		componentWillReceiveProps(nextProps) {
			if (this.checkModals(nextProps)) {
				if (!this.previousChildren) {
					// save the old children (just like animation)
					this.previousChildren = this.props.children;
				}
			} else {
				this.previousChildren = null;
			}
		},

		render() {
			return <Component {...this.props} children={ this.previousChildren ? this.previousChildren : this.props.children }/>;
		},
	});

	return ModalHandlerDecorator;
}
