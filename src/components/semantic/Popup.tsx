import PropTypes from 'prop-types';
import React, { useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

import 'fomantic-ui-css/components/popup';
import 'fomantic-ui-css/components/popup.min.css';


type ChildType = React.ReactElement<any>;

export interface PopupProps {
  settings?: SemanticUI.PopupSettings;
  trigger: React.ReactNode;
  onHover?: boolean;
  position?: string;
  triggerClassName?: string;
  className?: string;
  children: ChildType | ((hide: () => void) => ChildType);
  contentUpdateTrigger?: any; // Changes to this value will trigger re-render for the popup content
}


interface PopupContentProps extends Pick<PopupProps, 'children'> {
  node: Element;
  onHide: () => void;
  onShow: () => void;
  hide: () => void;
  contentUpdateTrigger?: any;
}

const PopupContent: React.FC<PopupContentProps> = props => {
  const content = useMemo<ChildType>(
    () => {
      const { children } = props;
      return typeof children === 'function' ? children(props.hide) : children as ChildType;
    }, 
    [ props.contentUpdateTrigger ]
  );

  useEffect(
    () => {
      props.onShow();
      return () => {
        props.onHide();
      };
    },
    []
  );

  return ReactDOM.createPortal(
    content,
    props.node
  );
};


interface State {
  visible: boolean;
}
class Popup extends React.PureComponent<PopupProps, State> {
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

    let className = 'ui flowing popup ';
    if (this.props.className) {
      className += this.props.className;
    }

    this.node.className = className;
    document.body.appendChild(this.node);
    
    this.setState({
      visible: true
    });
  }

  destroyPortal = () => {
    if (!this.node) {
      // onHidden called when the popup was removed manually
      return;
    }

    $(this.triggerNode).popup('destroy');

    document.body.removeChild(this.node);
    this.node = null;
  }

  hide = () => {
    $(this.triggerNode).popup('hide');
  }

  onHidden = () => {
    this.setState({
      visible: false
    });
  }

  show = () => {
    let settings: SemanticUI.PopupSettings = {
      on: this.props.onHover ? 'hover' : 'click',
      movePopup: false,
      popup: this.node as any as JQuery<HTMLElement>,
      onHidden: () => this.onHidden(),
      position: this.props.position,
      ...this.props.settings,
    };

    $(this.triggerNode).popup(settings).popup('show');
  }

  handleClick = () => {
    if (this.node) {
      return;
    }

    this.createPortalNode();
  }

  render() {
    const { triggerClassName, onHover, trigger, children, contentUpdateTrigger } = this.props;
    const triggerProps = {
      ref: (c: any) => this.triggerNode = c,
      className: classNames(triggerClassName, 'popup trigger'),
    };

    if (onHover) {
      triggerProps['onMouseEnter'] = this.handleClick;
    } else {
      triggerProps['onClick'] = this.handleClick;
    }

    const { visible } = this.state;
    return (
      <>
        <span { ...triggerProps }>
          { trigger }
        </span>
        { visible && !!this.node && (
          <PopupContent
            children={ children }
            node={ this.node }
            onShow={ this.show }
            onHide={ this.destroyPortal }
            hide={ this.hide }
            contentUpdateTrigger={ contentUpdateTrigger }
          />
        ) }
      </>
    );
  }
}

export default Popup;