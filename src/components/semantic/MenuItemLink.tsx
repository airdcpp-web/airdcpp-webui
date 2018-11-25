'use strict';
//import PropTypes from 'prop-types';
import React from 'react';

import classNames from 'classnames';

import Icon, { IconType } from 'components/semantic/Icon';

export interface MenuItemLinkProps {
  className?: string;
  icon?: IconType;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

const MenuItemLink: React.FC<MenuItemLinkProps> = (
  { className = undefined, icon, children, onClick, active = false, disabled = false }
) => {
  const itemClass = classNames(
    'item',
    className,
    { 'active': active },
    { 'disabled': disabled },
  );

  return (
    <a className={ itemClass } onClick={ onClick }>
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
