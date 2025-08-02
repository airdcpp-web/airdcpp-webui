import { useMemo, useEffect } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

import 'fomantic-ui-css/components/popup';
import 'fomantic-ui-css/components/popup.min.css';
import { AnimationConstants } from '@/constants/UIConstants';

type ChildType = React.ReactElement<any>;

export interface PopupProps {
  // Additional settings for the Semantic UI popup
  settings?: SemanticUI.PopupSettings;

  // Element that will trigger the popup when clicking on it
  trigger: React.ReactNode;

  // Show the popup on hover instead of when clicking the element
  onHover?: boolean;
  position?: string;
  triggerClassName?: string;
  className?: string;
  children: ChildType | ((hide: () => void) => ChildType);
  contentUpdateTrigger?: any; // Changes to this value will trigger re-render for the popup content
  triggerProps?: React.HTMLAttributes<HTMLSpanElement>;
}

interface PopupContentProps extends Pick<PopupProps, 'children'> {
  node: Element;
  onHide: () => void;
  onShow: () => void;
  hide: () => void;
  contentUpdateTrigger?: any;
}

const PopupContent: React.FC<PopupContentProps> = (props) => {
  const content = useMemo<ChildType>(() => {
    const { children } = props;
    return typeof children === 'function' ? children(props.hide) : children;
  }, [props.contentUpdateTrigger]);

  useEffect(() => {
    props.onShow();
    return () => {
      props.onHide();
    };
  }, []);

  return ReactDOM.createPortal(content, props.node);
};

interface State {
  visible: boolean;
}
class Popup extends React.PureComponent<PopupProps, State> {
  static readonly defaultProps: Pick<PopupProps, 'position' | 'triggerClassName'> = {
    position: 'bottom left',
    triggerClassName: '',
  };

  state: State = {
    visible: false,
  };

  node: Element | null;
  triggerNode: Element;
  componentWillUnmount() {
    if (this.node) {
      this.hide();
    }
  }

  createPortalNode = () => {
    // Create portal
    this.node = document.createElement('div');
    this.node.className = classNames('ui flowing popup', this.props.className);
    document.body.appendChild(this.node);

    this.setState({
      visible: true,
    });
  };

  destroyPortal = () => {
    if (!this.node) {
      // onHidden called when the popup was removed manually
      return;
    }

    $(this.triggerNode).popup('destroy');

    document.body.removeChild(this.node);
    this.node = null;
  };

  hide = () => {
    $(this.triggerNode).popup('hide');
  };

  onHidden = () => {
    this.setState({
      visible: false,
    });
  };

  show = () => {
    const settings: SemanticUI.PopupSettings = {
      on: this.props.onHover ? 'hover' : 'click',
      movePopup: false,
      popup: this.node as any as JQuery<HTMLElement>,
      onHidden: () => this.onHidden(),
      position: this.props.position,
      duration: AnimationConstants.popup,
      ...this.props.settings,
    };

    $(this.triggerNode).popup(settings).popup('show');
  };

  handleClick = () => {
    if (this.node) {
      return;
    }

    this.createPortalNode();
  };

  getTriggerProps = () => {
    const { triggerClassName, onHover, triggerProps: customTriggerProps } = this.props;

    const triggerProps = {
      ...customTriggerProps,
      ref: (c: any) => (this.triggerNode = c),
      className: classNames(triggerClassName, 'popup trigger'),
    };

    if (onHover) {
      triggerProps['onMouseEnter'] = this.handleClick;
    } else {
      triggerProps['onClick'] = this.handleClick;
    }

    return triggerProps;
  };

  render() {
    const { trigger, children, contentUpdateTrigger } = this.props;

    const { visible } = this.state;
    return (
      <>
        <span {...this.getTriggerProps()}>{trigger}</span>
        {visible && !!this.node && (
          <PopupContent
            node={this.node}
            onShow={this.show}
            onHide={this.destroyPortal}
            hide={this.hide}
            contentUpdateTrigger={contentUpdateTrigger}
          >
            {children}
          </PopupContent>
        )}
      </>
    );
  }
}

export default Popup;
