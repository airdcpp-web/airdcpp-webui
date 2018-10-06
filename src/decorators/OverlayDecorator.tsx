'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import invariant from 'invariant';

import History from 'utils/History';

import '../style.css';


export interface OverlayDecoratorProps {
  returnTo: string;
}

export interface OverlayDecoratorChildProps {
  showOverlay: (component: any, semanticComponentSettings: SemanticUI.ModalSettings) => void;
  hide: () => void;
}

export default function <PropsT>(
  Component: React.ComponentType<PropsT & OverlayDecoratorChildProps>
) {
  class OverlayDecorator extends React.Component<OverlayDecoratorProps & PropsT> {
    static displayName = 'OverlayDecorator';

    closing = false;
    returnOnClose = true;

    c: any;

    componentWillUnmount() {
      if (!this.closing) {
        this.returnOnClose = false;
        this.hide();
      }
    }

    componentDidMount() {
      this.returnOnClose = true;
    }

    showOverlay = (c: any, componentSettings = {}) => {
      invariant(c, 'Component missing from showOverlay');

      this.c = c;

      const settings = {
        onHidden: this.onHidden,
        onHide: this.onHide,
      } as SemanticUI.ModalSettings;

      setTimeout(() => {
        $(this.c)
          .modal({
            ...componentSettings,
            ...settings,
          })
          .modal('show');
      });
    }

    hide = () => {
      invariant(this.c, 'Component not set when hiding overlay');
      $(this.c).modal('hide');
    }

    onHide = () => {
      this.closing = true;
    }

    onHidden = () => {
      if (this.returnOnClose) {
        History.replace(this.props.returnTo /*, this.context.router.route.location.state*/);
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
