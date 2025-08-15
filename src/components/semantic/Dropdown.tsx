import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import DropdownCaption from './DropdownCaption';
import Icon, { IconType } from './Icon';

import 'fomantic-ui-css/components/button.min.css';
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
  caption?: React.ReactNode;

  className?: string;
  captionIcon?: IconType;
  selection?: boolean;
  dropDownElementProps?: React.HTMLAttributes<HTMLDivElement>;
  size?: string;
  menuElementClassName?: string;
  label?: string;
}>;

const Dropdown: React.FC<DropdownProps> = ({
  triggerIcon,
  direction = 'auto',
  settings,
  contextElement,
  button,
  leftIcon,
  caption,
  className,
  captionIcon,
  selection,
  dropDownElementProps,
  size,
  menuElementClassName,
  label,
  children,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  const computedIcon = useMemo<IconType>(() => {
    if (triggerIcon !== undefined) {
      return triggerIcon;
    }
    return selection ? 'dropdown' : IconConstants.EXPAND;
  }, [triggerIcon, selection]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) {
      return;
    }

    const dropdownSettings: SemanticUI.DropdownSettings = {
      direction,
      action: 'hide',
      showOnFocus: false,
      duration: AnimationConstants.dropdown,
      onShow: () => {
        // console.log('Dropdown onShow');
        setVisible(true);
      },
      onHide: () => {
        // console.log('Dropdown onHide');
        // Wait for hide animation before unmounting menu content
        setTimeout(() => setVisible(false), AnimationConstants.dropdown);
      },

      // debug: true,
      // verbose: true,

      ...settings,
    };

    if (contextElement) {
      dropdownSettings.context = contextElement;
    }

    $(el).dropdown(dropdownSettings);

    return () => {
      try {
        $(el).dropdown('destroy');
      } catch {
        // ignore
      }
    };
  }, [direction, settings, contextElement]);

  const dropdownClassName = classNames(
    'ui',
    'dropdown',
    'item',
    size,
    className,
    { 'icon button': button },
    { labeled: !!button && !!caption },
    { 'left-icon': leftIcon },
    { 'selection fluid': selection },
  );

  const trigger = <Icon icon={computedIcon} className="trigger" />;

  return (
    <div
      ref={rootRef}
      {...dropDownElementProps}
      className={dropdownClassName}
      aria-label={label}
    >
      {leftIcon && !!caption && trigger}

      <DropdownCaption icon={captionIcon} role="button">
        {!!caption ? caption : trigger}
      </DropdownCaption>

      {!leftIcon && !!caption ? trigger : null}

      <div
        className={classNames('menu', menuElementClassName)}
        role={visible ? 'menu' : undefined}
      >
        {visible ? children : <div className="item" />}
      </div>
    </div>
  );
};

export default Dropdown;
