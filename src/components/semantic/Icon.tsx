//import PropTypes from 'prop-types';
import * as React from 'react';

import classNames from 'classnames';

export type IconType = React.ReactElement<any> | string | null;
export type CornerIconType = string | null;

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  icon?: IconType;
  cornerIcon?: string | null;
  size?: string;
  color?: string;
}

const Icon: React.FC<IconProps> = ({
  icon,
  size,
  color,
  className,
  cornerIcon,
  ...other
}) => {
  if (typeof icon !== 'string') {
    return !!icon ? icon : null;
  }

  if (cornerIcon) {
    return (
      <i
        className={classNames(size, className, { link: !!other.onClick }, 'icons')}
        {...other}
      >
        <i className={classNames(color, icon, 'icon')} />
        <i className={classNames(cornerIcon, 'corner icon')} />
      </i>
    );
  }

  return (
    <i
      className={classNames(
        color,
        size,
        icon,
        className,
        { link: !!other.onClick },
        'icon'
      )}
      {...other}
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
