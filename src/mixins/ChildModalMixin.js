// This can't handle nested modals

import React from 'react';

import { History } from 'react-router'

export default {
  mixins: [ History ],
  componentWillReceiveProps (nextProps) {
    // if we changed routes...
    if ((
      !this.node &&
      nextProps.location.state &&
      nextProps.location.state.modal
    )) {
      this.returnTo = this.props.location.pathname;

      this.node = document.createElement('div');
      document.body.appendChild(this.node);
    }
  },

  componentDidUpdate() {
    if (this.node) {
      let children = React.cloneElement(this.props.children, { closeHandler: this.removeModal });
      React.render(children, this.node);
  	}
  },

  removeModal() {
	  React.unmountComponentAtNode(this.node);
	  document.body.removeChild(this.node);
	  this.node = null;

	  this.history.replaceState(null, this.returnTo);
  }
};