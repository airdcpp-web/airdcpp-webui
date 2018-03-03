'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import ReactDOM from 'react-dom';

import invariant from 'invariant';

import History from 'utils/History';

import '../style.css';


export default function (Component, semanticModuleName) {
  class OverlayDecorator extends React.Component {
    static displayName = 'OverlayDecorator';

    static propTypes = {
      overlayId: PropTypes.any.isRequired,
    };

    static contextTypes = {
      router: PropTypes.object.isRequired,
    };

    closing = false;
    returnOnClose = true;

    componentWillUnmount() {
      if (!this.closing) {
        this.returnOnClose = false;
        this.hide();
      }
    }

    componentWillReceiveProps(nextProps, nextLocation) {
      if (nextLocation.router.route.location.state[this.props.overlayId].data.close) {
        this.hide();
      }
    }

    showOverlay = (c, componentSettings = {}) => {
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
    };

    hide = () => {
      invariant(this.c, 'Component not set when hiding overlay');
      $(this.c)[semanticModuleName]('hide');
    };

    onHide = () => {
      this.closing = true;
    };

    onHidden = () => {
      // Don't change the history state if we navigating back using the browser history
      if (History.action !== 'POP') {
        History.removeOverlay(this.context.router.route.location, this.props.overlayId, this.returnOnClose);
      }
    };

    render() {
      return ReactDOM.createPortal((
        <Component 
          { ...this.props } 
          { ...this.state }
          showOverlay={ this.showOverlay } 
          hide={ this.hide }
        />
      ), document.getElementById('modals-node'));
    }
  }

  return OverlayDecorator;
}
