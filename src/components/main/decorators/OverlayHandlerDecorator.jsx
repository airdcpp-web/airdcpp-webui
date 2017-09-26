import React from 'react';
import ReactDOM from 'react-dom';

import History from 'utils/History';
import OverlayConstants from 'constants/OverlayConstants';


// A decorator for handling of modals and sidebar
// This should be used with main layouts that are displayed only when socket is connected
// to avoid issues with modals

// Parse the last leaf node from childen
const getLeafChildNode = (currentChild) => {
  if (currentChild.props.children) {
    return getLeafChildNode(currentChild.props.children);
  }

  return currentChild;
};

// Return true if the sidebar should be shown
const showSidebar = (props) => {
  return History.hasSidebar(props.location);
};


export default function (Component) {
  class ModalHandlerDecorator extends React.Component {
    // DOM nodes and React elements of open modals
    modals = {};

    createNode = (key, element) => {
      let node = document.createElement('div');
      document.body.appendChild(node);
      this.modals[key] = { node, element };
      return node;
    };

    removeNode = (key) => {
      let modal = this.modals[key];
      if (modal) {
        document.body.removeChild(modal.node);
        delete this.modals[key];
      }
    };

    // Create modal element from router history for the given key
    getModal = (key, location, element) => {
      const { state } = location;
      const modalComponent = getLeafChildNode(element);
      const ret = React.cloneElement(modalComponent, {
        // Pass the location data as props
        // Note: isRequired can't be used in proptypes because the element is cloned
        ...state[key].data,

        onHidden: () => {
          this.removeNode(key);
        },

        overlayId: key,
      });

      return ret;
    };

    checkModals = (props) => {
      const modalIds = History.getModalIds(props.location);
      if (!modalIds) {
        return false;
      }

      // Open all modals that don't currently exist
      modalIds
        .filter(key => !this.modals[key])
        .forEach(key => this.createNode(key, this.getModal(key, props.location, props.children)));

      return true;
    };

    componentWillMount() {
      if (showSidebar(this.props) || this.checkModals(this.props)) {
        // previousChildren must exist if overlays are present
        this.previousChildren = <div/>;
      }
    }

    componentWillUnmount() {
      // Connection lost, remove all modals
      Object.keys(this.modals).forEach(key => {
        History.removeOverlay(this.props.location, key);
      });
    }

    componentWillReceiveProps(nextProps) {
      if (this.checkModals(nextProps) || showSidebar(nextProps)) {
        if (!this.previousChildren) {
          // save the old children (just like animation)
          this.previousChildren = this.props.children;
        }
      } else {
        this.previousChildren = null;
      }
    }

    render() {
      let sidebar = null;
      if (showSidebar(this.props)) {
        sidebar = React.cloneElement(this.props.children, { 
          overlayId: OverlayConstants.SIDEBAR_ID,
          overlayContext: '.sidebar-context',
        });
      }

      return (
        <Component 
          { ...this.props } 
          sidebar={ sidebar } 
        >
          { this.previousChildren ? this.previousChildren : this.props.children }
          { !!this.modals && Object.values(this.modals).map(modal => ReactDOM.createPortal(modal.element, modal.node)) }
        </Component>
      );
    }
  }

  return ModalHandlerDecorator;
}
