'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import ReactDOM from 'react-dom';

import invariant from 'invariant';

import History from 'utils/History';

import '../style.css';
import { RouterChildContext } from 'react-router-dom';


export interface OverlayDecoratorProps {
  overlayId?: any; // REQUIRED, CLONED
}

export interface OverlayDecoratorChildProps<SemanticSettingPropsT> {
  showOverlay: (component: any, semanticComponentSettings: SemanticSettingPropsT) => void;
  hide: () => void;
}

export default function <PropsT, SemanticSettingPropsT>(
  Component: React.ComponentType<PropsT & OverlayDecoratorChildProps<SemanticSettingPropsT>>, 
  semanticModuleName: string
) {
  class OverlayDecorator extends React.Component<OverlayDecoratorProps & PropsT> {
    static displayName = 'OverlayDecorator';

    static propTypes = {
      overlayId: PropTypes.any.isRequired,
    };

    context: RouterChildContext<{}>;
    static contextTypes = {
      router: PropTypes.object.isRequired,
    };

    closing = false;
    returnOnClose = true;

    c: any;

    componentWillUnmount() {
      if (!this.closing) {
        this.returnOnClose = false;
        this.hide();
      }
    }

    UNSAFE_componentWillReceiveProps() {
      if (this.context.router.route.location.state[this.props.overlayId].data.close) {
        this.hide();
      }
    }

    showOverlay = (c: any, componentSettings = {}) => {
      invariant(c, 'Component missing from showOverlay');

      this.c = c;

      invariant(
        this.props.overlayId, 
        'OverlayDecorator: overlayId missing (remember to pass props to the overlay component)'
      );

      const settings = Object.assign(componentSettings, {
        onHidden: this.onHidden,
        onHide: this.onHide,
      });

      setTimeout(() => {
        $(this.c)[semanticModuleName](settings)[semanticModuleName]('show');
      });
    }

    hide = () => {
      invariant(this.c, 'Component not set when hiding overlay');
      $(this.c)[semanticModuleName]('hide');
    }

    onHide = () => {
      this.closing = true;
    }

    onHidden = () => {
      // Don't change the history state if we navigating back using the browser history
      if (History.action !== 'POP') {
        History.removeOverlay(this.context.router.route.location, this.props.overlayId, this.returnOnClose);
      }
    }

    render() {
      return ReactDOM.createPortal(
        (
          <Component 
            { ...this.props } 
            showOverlay={ this.showOverlay } 
            hide={ this.hide }
          />
        ), 
        document.getElementById('modals-node')!
      );
    }
  }

  return OverlayDecorator;
}
