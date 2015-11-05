import React from 'react';
import ReactDOM from 'react-dom';

// Pass the wrapped component, an unique ID for it (use OverlayConstants)
// If no DOM ID is provided, a new one will be created in body
export default function (Component, overlayId, createPortal = true) {
	let node = null;

	const removeNode = () => {
		if (node) {
			ReactDOM.unmountComponentAtNode(node);
			document.body.removeChild(node);
			node = null;
		}
	};

	const OverlayPortalDecorator = React.createClass({
		getOverlay() {
			// Causes more bugs when this is enabled, think something better later
			// It can still mess up the history when quickly going back and forward
			//if (closing)
			//	return null;

			const { state } = this.props.location;
			const ret = React.cloneElement(this.props.children, { 
				onHidden: () => {
					removeNode();
				},

				overlayId: overlayId,
				...state[overlayId].data
			});

			return ret;
		},

		checkCreateModal() {
			if (!createPortal) {
				return;
			}

			if ((
				!node &&
				this.props.location.state &&
				this.props.location.state[overlayId]
			)) {
				node = document.createElement('div');
				document.body.appendChild(node);

				ReactDOM.render(this.getOverlay(this.props), node);
			}
		},

		componentDidMount() {
			// Reloading page?
			this.checkCreateModal();
		},

		componentDidUpdate() {
			// Opening new?
			this.checkCreateModal();
		},

		render() {
			return <Component {...this.props} {...this.state}/>;
		}
	});

	return OverlayPortalDecorator;
};
