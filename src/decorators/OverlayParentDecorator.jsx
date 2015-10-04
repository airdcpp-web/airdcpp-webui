import React from 'react';

import History from 'utils/History'

// Pass the wrapped component, an unique ID for it (use OverlayConstants)
// If no DOM ID is provided, a new one will be created in body
export default function(Component, overlayId, createPortal = true) {
  let node = null;

  const replaceState = (props) => {
    const { returnTo } = props.location.state[overlayId];
    delete props.location.state[overlayId];
    History.replaceState(props.location.state, returnTo);
  }

  const removeNode = () => {
    if (node) {
      React.unmountComponentAtNode(node);
      document.body.removeChild(node);
      node = null;
    }
  };

  const getOverlay = (props) => {
      const { state } = props.location;
      return React.cloneElement(props.children, { 
        removeHandler: removeNode,
        restoreState: () => replaceState(props),
        ...((state && state[overlayId]) ? state[overlayId].data : null)
      });
  };

  const OverlayParentDecorator = React.createClass({
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

        React.render(getOverlay(this.props), node);
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
      return <Component {...this.props} {...this.state} getOverlay={ getOverlay }/>
    }
  });

  return OverlayParentDecorator;
};