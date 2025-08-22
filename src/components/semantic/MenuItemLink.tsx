import * as React from 'react';

import classNames from 'classnames';

import Icon, { IconType } from '@/components/semantic/Icon';

export interface MenuItemLinkProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  icon?: IconType;
  onClick: (evt: React.SyntheticEvent<any>) => void;
  active?: boolean;
  disabled?: boolean;
  submenuIcon?: string;
  children: React.ReactNode | React.ReactNode[];
  role?: string;
}

const MenuItemLink: React.FC<MenuItemLinkProps> = ({
  className,
  icon,
  children,
  onClick,
  active = false,
  disabled = false,
  submenuIcon,
  role = 'menuitem',
  ...other
}) => {
  const itemClass = classNames(
    'item',
    'link',
    className,
    { submenu: !!submenuIcon },
    { active: active },
    { disabled: disabled },
  );

  const tabIndex = disabled ? -1 : active ? 0 : -1;
  return (
    <div
      className={itemClass}
      onClick={disabled ? undefined : onClick}
      role={role}
      tabIndex={tabIndex}
      aria-selected={active}
      aria-disabled={disabled}
      {...other}
    >
      <Icon icon={icon} />
      <Icon icon={submenuIcon} />
      {children}
    </div>
  );
};

export default MenuItemLink;
