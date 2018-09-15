//import PropTypes from 'prop-types';
import React from 'react';

import classNames from 'classnames';


export type IconType = React.ReactElement<any> | string | null;
export type CornerIconType = string | null;

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  icon?: IconType;
  cornerIcon?: string | null;
  size?: string;
}

const Icon: React.SFC<IconProps> = ({ icon, size, className, cornerIcon, ...other }) => {
  if (typeof icon !== 'string') {
    return !!icon ? icon : null;
  }

  if (cornerIcon) {
    return (
      <i 
        className={ classNames(size, className, 'icons') }
        { ...other }
      >
        <i className={ classNames(icon, 'icon') }/>
        <i className={ classNames(cornerIcon, 'corner icon') }/>
      </i>
    );
  }

  return (
    <i 
      className={ classNames(size, icon, className, 'icon') }
      { ...other }
    />
  );
};

/*Icon.propTypes = {
  // Icon class
  icon: PropTypes.node,

  cornerIcon: PropTypes.string,

  className: PropTypes.string,

  size: PropTypes.string,
};*/

export default Icon;
