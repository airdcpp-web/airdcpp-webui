import * as React from 'react';
import invariant from 'invariant';

import classNames from 'classnames';

import DropdownCaption from './DropdownCaption';
import Icon, { IconType } from './Icon';

import 'fomantic-ui-css/components/button.min.css'; // for button style
import 'fomantic-ui-css/components/dropdown';
import 'fomantic-ui-css/components/dropdown.min.css';
import IconConstants from '@/constants/IconConstants';
import { AnimationConstants } from '@/constants/UIConstants';

export type DropdownProps = React.PropsWithChildren<{
  // If caption isn't specified, the icon will be used as main trigger
  triggerIcon?: IconType;

  // Direction to render
  direction?: 'auto' | 'upward' | 'downward';
  settings?: SemanticUI.DropdownSettings;

  // Returns DOM node used for checking whether the dropdown can fit on screen
  contextElement?: string;

  // Render as button
  button?: boolean;

  // Show trigger icon on the left side of the caption instead of after it
  leftIcon?: boolean;

  // Node to render as caption
  caption?: React.ReactNode;

  className?: string;
  captionIcon?: IconType;
  selection?: boolean;
  dropDownElementProps?: React.HTMLAttributes<HTMLDivElement>;
  size?: string;
  menuElementClassName?: string;
  label?: string;
}>;

interface State {
  visible: boolean;
}

class Dropdown extends React.PureComponent<DropdownProps, State> {
  static readonly defaultProps: Pick<DropdownProps, 'direction' | 'leftIcon'> = {
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
    visible: false,
  };

  init = () => {
    const { contextElement, direction } = this.props;
    const settings: SemanticUI.DropdownSettings = {
      direction,
      action: 'hide',
      showOnFocus: false, // It can become focused when opening a modal
      onShow: () => {
        this.setState({
          visible: true,
        });
      },
      onHide: () => {
        setTimeout(
          // Handle possible item click events before removing the items...
          () => {
            this.setState({
              visible: false,
            });
          },
          AnimationConstants.dropdown,
        );
      },
      duration: AnimationConstants.dropdown,
      ...this.props.settings,
      //debug: true,
      //verbose: true,
    };

    if (contextElement) {
      settings['context'] = contextElement;
      invariant(settings['context'], 'Context missing from dropdown');
    }

    $(this.c).dropdown(settings);
  };

  getIcon = () => {
    const { triggerIcon, selection } = this.props;

    if (triggerIcon !== undefined) {
      return triggerIcon;
    }

    return selection ? 'dropdown' : IconConstants.EXPAND;
  };

  render() {
    const {
      leftIcon,
      caption,
      button,
      captionIcon,
      dropDownElementProps,
      selection,
      size,
      menuElementClassName,
      children,
      label,
    } = this.props;

    const className = classNames(
      'ui',
      'dropdown',
      'item',
      size,
      this.props.className,
      { 'icon button': button },
      { labeled: !!button && !!caption },
      { 'left-icon': leftIcon },
      { 'selection fluid': selection },
    );

    const icon = <Icon icon={this.getIcon()} className="trigger" />;

    const { visible } = this.state;
    return (
      <div
        ref={(c) => {
          this.c = c!;
        }}
        {...dropDownElementProps}
        className={className}
        aria-label={label}
      >
        {leftIcon && !!caption && icon}
        <DropdownCaption icon={captionIcon} role="button">
          {!!caption ? caption : icon}
        </DropdownCaption>
        {leftIcon || !caption ? null : icon}

        <div
          className={classNames('menu', menuElementClassName)}
          role={visible ? 'menu' : undefined}
        >
          {visible ? children : <div className="item" />}
        </div>
      </div>
    );
  }
}

export default Dropdown;
