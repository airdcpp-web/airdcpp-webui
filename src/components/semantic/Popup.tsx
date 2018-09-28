import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

import 'semantic-ui-css/components/popup';
import 'semantic-ui-css/components/popup.min.css';


type ChildType = React.ReactElement<{
  hide: () => void;
}>;

export interface PopupProps {
  settings?: SemanticUI.PopupSettings;
  trigger: React.ReactNode;
  onHover?: boolean;
  position?: string;
  triggerClassName?: string;
  className?: string;
  children: ChildType | (() => ChildType);
}

class Popup extends React.PureComponent<PopupProps> {
  static propTypes = {

    // Additional settings for the Semantic UI popup
    settings: PropTypes.object,

    // Element that will trigger the popup when clicking on it
    trigger: PropTypes.node.isRequired,

    // Show the popup on hover instead of when clicking the element
    onHover: PropTypes.bool,

    position: PropTypes.string,

    triggerClassName: PropTypes.string,
  };

  static defaultProps: Pick<PopupProps, 'position' | 'triggerClassName'> = {
    position: 'bottom left',
    triggerClassName: '',
  };

  node: any;
  triggerNode: any;
  componentWillUnmount() {
    if (this.node) {
      this.hide();
    }
  }

  createPortal = () => {
    // Create portal
    this.node = document.createElement('div');

    let className = 'ui flowing popup ';
    if (this.props.className) {
      className += this.props.className;
    }

    this.node.className = className;
    document.body.appendChild(this.node);
  }

  hide = () => {
    $(this.triggerNode).popup('hide');
  }

  onHidden = () => {
    if (!this.node) {
      // onHidden called when the popup was removed manually
      return;
    }

    $(this.triggerNode).popup('destroy');

    ReactDOM.unmountComponentAtNode(this.node);
    document.body.removeChild(this.node);
    this.node = null;
  }

  getContent = () => {
    const { children } = this.props;
    if (typeof children === 'function') {
      return children();
    }

    return children as ChildType;
  }

  show = () => {
    if (this.node) {
      return;
    }

    this.createPortal();

    const children = React.cloneElement(this.getContent(), {
      hide: this.hide,
    });

    ReactDOM.render(children, this.node);

    // Common settings
    let settings: SemanticUI.PopupSettings = {
      on: this.props.onHover ? 'hover' : 'click',
      movePopup: false,
      popup: this.node,
      onHidden: () => this.onHidden(),
      position: this.props.position,
      ...this.props.settings,
    };

    $(this.triggerNode).popup(settings).popup('show');
  }

  handleClick = () => {
    this.show();
  }

  render() {
    const triggerProps = {
      ref: (c: any) => this.triggerNode = c,
      className: classNames(this.props.triggerClassName, 'popup trigger'),
    };

    if (this.props.onHover) {
      triggerProps['onMouseEnter'] = this.handleClick;
    } else {
      triggerProps['onClick'] = this.handleClick;
    }

    return (
      <span { ...triggerProps }>
        { this.props.trigger }
      </span>
    );
  }
}

export default Popup;