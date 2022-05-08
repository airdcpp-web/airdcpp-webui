import PropTypes from 'prop-types';
import * as React from 'react';
import invariant from 'invariant';

import classNames from 'classnames';

import DropdownCaption from './DropdownCaption';
import Icon, { IconType } from './Icon';

import 'fomantic-ui-css/components/button.min.css'; // for button style
import 'fomantic-ui-css/components/dropdown';
import 'fomantic-ui-css/components/dropdown.min.css';
import IconConstants from 'constants/IconConstants';


export type DropdownProps = React.PropsWithChildren<{
  triggerIcon?: IconType;
  direction?: 'auto' | 'upward' | 'downward';
  settings?: SemanticUI.DropdownSettings;
  contextElement?: string;
  button?: boolean;
  leftIcon?: boolean;
  caption?: React.ReactNode;
  className?: string;
  captionIcon?: IconType;
  selection?: boolean;
  dropDownElementProps?: React.HTMLAttributes<HTMLDivElement>;
  size?: string;
  menuElementClassName?: string;
}>;

interface State {
  visible: boolean;
}

const ANIMATION_DURATION = 200;

class Dropdown extends React.PureComponent<DropdownProps, State> {
  static propTypes = {
    // Node to render as caption
    caption: PropTypes.node,

    // If caption isn't specified, the icon will be used as main trigger
    triggerIcon: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),

    // Show trigger icon on the left side of the caption instead of after it
    leftIcon: PropTypes.bool,

    // Direction to render
    direction: PropTypes.string,

    // Returns DOM node used for checking whether the dropdown can fit on screen
    contextElement: PropTypes.string,

    // Render as button
    button: PropTypes.bool,

    settings: PropTypes.object,
  };

  static defaultProps: Pick<DropdownProps, 'direction' | 'leftIcon'> = {
    direction: 'auto',
    leftIcon: false,
  };

  c: HTMLDivElement;

  componentDidMount() {
    // Use timeout to allow all parents finish mounting (otherwise we get no context)
    setTimeout(this.init);
  }

  componentWillUnmount() {
    if (this.c) {
      $(this.c).dropdown('destroy');
    }
  }
  
  state: State = {
    visible: false
  };

  init = () => {
    const settings: SemanticUI.DropdownSettings = {
      direction: this.props.direction,
      action: 'hide',
      showOnFocus: false, // It can become focused when opening a modal
      onShow: () => {
        this.setState({
          visible: true
        });
      },
      onHide: () => {
        setTimeout( // Handle possible item click events before removing the items...
          () => {
            this.setState({
              visible: false
            });
          },
          ANIMATION_DURATION
        );
      },
      duration: ANIMATION_DURATION,
      ...this.props.settings,
      //debug: true,
      //verbose: true,
    };

    if (this.props.contextElement) {
      settings['context'] = this.props.contextElement;
      invariant(settings['context'], 'Context missing from dropdown');
    }

    $(this.c).dropdown(settings);
  }

  render() {
    const { 
      leftIcon, caption, button, triggerIcon, captionIcon, dropDownElementProps, selection, size, menuElementClassName 
    } = this.props;

    const className = classNames(
      'ui',
      'dropdown',
      'item',
      size,
      this.props.className,
      { 'icon button': button },
      { 'labeled': !!button && !!caption },
      { 'left-icon': leftIcon },
      { 'selection fluid': selection },
    );

    const icon = (
      <Icon 
        icon={ triggerIcon !== undefined ? triggerIcon : (selection ? 'dropdown' : IconConstants.EXPAND) } 
        className="trigger"
      />
    );

    return (
      <div 
        ref={ c => this.c = c! } 
        { ...dropDownElementProps }
        className={ className }
      >
        { (leftIcon && !!caption) && icon }
        <DropdownCaption 
          icon={ captionIcon }
        >
          { !!caption ? caption : icon }
        </DropdownCaption>
        { leftIcon || !caption ? null : icon }

        <div className={ classNames('menu', menuElementClassName) }>
          { this.state.visible ? this.props.children : <div className="item"/> }
        </div>
      </div>
    );
  }
}

export default Dropdown;
