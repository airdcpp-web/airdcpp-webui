'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import { Lifecycle } from 'mixins/RouterMixin';
import invariant from 'invariant';

import History from 'utils/History';

import '../style.css';


export default function (Component, semanticModuleName) {
  const OverlayDecorator = React.createClass({
    mixins: [ Lifecycle ],
    changeHistoryState: true,
    routerWillLeave(nextLocation) {
      if (nextLocation.pathname.indexOf(this.props.location.pathname) !== 0) {
        this.changeHistoryState = false;
        this.hide();
      }
    },

    propTypes: {
      /**
			 * Removes portal from DOM
			 */
      onHidden: PropTypes.func,

      /**
			 * Returns to the location that was active before opening the overlay
			 */
      onHide: PropTypes.func,

      location: PropTypes.object.isRequired,
      overlayId: PropTypes.any, // Required
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
      if (this.props.onHide) {
        this.props.onHide();
      }
    },

    onHidden() {
      if (this.changeHistoryState) {
        History.removeOverlay(this.props.location, this.props.overlayId);
      }

      if (this.props.onHidden) {
        this.props.onHidden(this.changeHistoryState);
      }
    },

    render() {
      return (
        <Component 
          { ...this.props } 
          { ...this.state } 
          showOverlay={ this.showOverlay } 
          hide={ this.hide }
        />
      );
    }
  });

  return OverlayDecorator;
}
