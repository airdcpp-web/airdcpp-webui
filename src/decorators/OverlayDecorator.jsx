import React from 'react';

import History from 'utils/History'

// Pass the wrapped component, an unique ID for it (use OverlayConstants)
// If no DOM ID is provided, a new one will be created in body
export default function(Component, overlayId, elementId = null) {
  let node;

  const removeModal = (props) => {
    React.unmountComponentAtNode(node);
    if (!elementId) {
      document.body.removeChild(node);
    }

    // Remove overlay from the location state
    const { returnTo } = props.location.state[overlayId];
    delete props.location.state[overlayId];
    History.replaceState(props.location.state, returnTo);

    node = null;
  };

  const checkCreateModal = (props) => {
    if ((
      !node &&
      props.location.state &&
      props.location.state[overlayId]
    )) {
      if (elementId) {
        node = document.getElementById(elementId);
        if (!node) {
          return;
        }
      } else {
        node = document.createElement('div');
        document.body.appendChild(node);
      }

      // Pass the overlay props and close handler
      const { state } = props.location;
      let children = React.cloneElement(props.children, { 
        closeHandler: removeModal,
        ...((state && state[overlayId]) ? state[overlayId].data : null)
      });
      React.render(children, node);
    }
  };
  
  const OverlayDecorator = React.createClass({
    componentDidMount() {
      // Reloading page?
      checkCreateModal(this.props);
    },

    componentDidUpdate() {
      // Opening new?
      checkCreateModal(this.props);
    },

    render() {
      return <Component {...this.props} {...this.state}/>
    }
  });

  return OverlayDecorator;
};