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
}

const MenuItemLink: React.FC<MenuItemLinkProps> = ({
  className,
  icon,
  children,
  onClick,
  active = false,
  disabled = false,
  submenuIcon,
  style,
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

  return (
    <div {...other} className={itemClass} onClick={onClick}>
      <Icon icon={icon} />
      <Icon icon={submenuIcon} />
      {children}
    </div>
  );
};

export default MenuItemLink;
