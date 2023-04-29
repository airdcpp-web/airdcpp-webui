//import PropTypes from 'prop-types';
import * as React from 'react';

import classNames from 'classnames';

import Icon, { IconType } from 'components/semantic/Icon';

export interface MenuItemLinkProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  icon?: IconType;
  onClick: (evt: React.SyntheticEvent<any>) => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode | React.ReactNode[];
}

const MenuItemLink: React.FC<MenuItemLinkProps> = ({
  className,
  icon,
  children,
  onClick,
  active = false,
  disabled = false,
  style,
  ...other
}) => {
  const itemClass = classNames(
    'item',
    'link',
    className,
    { active: active },
    { disabled: disabled }
  );

  return (
    <div {...other} className={itemClass} onClick={onClick}>
      <Icon icon={icon} />
      {children}
    </div>
  );
};

/*MenuItemLink.propTypes = {
  //children: PropTypes.any.isRequired,

  icon: PropTypes.string,

  onClick: PropTypes.func.isRequired,

  active: PropTypes.bool,
};*/

export default MenuItemLink;
