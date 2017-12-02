'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import ReactDOM from 'react-dom';

import createReactClass from 'create-react-class';
import invariant from 'invariant';

import History from 'utils/History';

import '../style.css';


export default function (Component, semanticModuleName) {
  const OverlayDecorator = createReactClass({
    displayName: 'OverlayDecorator',
    closing: false,

    propTypes: {
      location: PropTypes.object.isRequired,
      overlayId: PropTypes.any, // Required
    },

    componentWillMount() {
      this.node = document.createElement('div');
      document.body.appendChild(this.node);
    },

    componentWillUnmount() {
      if (!this.closing) {
        this.hide();
      }
    },

    componentWillReceiveProps(nextProps) {
      if (nextProps.location.state[this.props.overlayId].data.close) {
        this.hide();
      }
    },

    showOverlay(c, componentSettings = {}) {
      invariant(c, 'Component missing from showOverlay');

      this.c = c;

      invariant(this.props.overlayId, 'OverlayDecorator: overlayId missing (remember to pass props to the overlay component)');
      const settings = Object.assign(componentSettings, {
        onHidden: this.onHidden,
        onHide: this.onHide,
      });

      setTimeout(_ => {
        $(this.c)[semanticModuleName](settings)[semanticModuleName]('show');
      });
    },

    hide() {
      invariant(this.c, 'Component not set when hiding overlay');
      $(this.c)[semanticModuleName]('hide');
    },

    onHide() {
      this.closing = true;
    },

    onHidden() {
      // Don't change the history state if we navigating back using the browser history
      if (History.action !== 'POP') {
        History.removeOverlay(this.props.location, this.props.overlayId);
      }

      document.body.removeChild(this.node);
      this.node = null;
    },

    render() {
      return ReactDOM.createPortal((
        <Component 
          { ...this.props } 
          { ...this.state } 
          showOverlay={ this.showOverlay } 
          hide={ this.hide }
        />
      ), this.node);
    },
  });

  return OverlayDecorator;
}
