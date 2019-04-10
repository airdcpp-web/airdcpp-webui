'use strict';
//import PropTypes from 'prop-types';
import React from 'react';

import classNames from 'classnames';

import Icon, { IconType } from 'components/semantic/Icon';

export interface MenuItemLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  icon?: IconType;
  onClick: (evt: React.SyntheticEvent<any>) => void;
  active?: boolean;
  disabled?: boolean;
}

const MenuItemLink: React.FC<MenuItemLinkProps> = (
  { className = undefined, icon, children, onClick, active = false, disabled = false, style, ...other }
) => {
  const itemClass = classNames(
    'item',
    className,
    { 'active': active },
    { 'disabled': disabled },
  );

  return (
    <a 
      { ...other }
      className={ itemClass } 
      onClick={ onClick }
    >
      <Icon icon={ icon }/>
      { children }
    </a>
  );
};

/*MenuItemLink.propTypes = {
  //children: PropTypes.any.isRequired,

  icon: PropTypes.string,

  onClick: PropTypes.func.isRequired,

  active: PropTypes.bool,
};*/

export default MenuItemLink;
