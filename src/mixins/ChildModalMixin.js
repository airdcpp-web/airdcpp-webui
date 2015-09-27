// This can't handle nested modals

import React from 'react';

import { History } from 'react-router'

export default {
  mixins: [ History ],
  componentWillUnmount() {
    // For cases where the socket connection was lost (modal would override the dimmer)
    if (this.node) {
      this.removeModal();
    }
  },

  componentDidMount() {
    // Reloading page?
    this.checkCreateModal(this.props);
  },

  componentDidUpdate() {
    // Opening new?
    this.checkCreateModal(this.props);
  },

  checkCreateModal() {
    if ((
      !this.node &&
      this.props.location.state &&
      this.props.location.state.modal
    )) {
      if (!this.returnTo) {
        this.returnTo = this.props.location.pathname;
      }

      this.node = document.createElement('div');
      document.body.appendChild(this.node);

      let children = React.cloneElement(this.props.children, { closeHandler: this.removeModal });
      React.render(children, this.node);
    }
  },

  removeModal() {
	  React.unmountComponentAtNode(this.node);
	  document.body.removeChild(this.node);
	  this.history.replaceState(null, this.returnTo);

    this.node = null;
    this.returnTo = null;
  }
};