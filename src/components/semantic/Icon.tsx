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
  onClick,
  ...other
}) => {
  if (typeof icon !== 'string') {
    return !!icon ? icon : null;
  }

  const onKeyDown = (evt: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (evt.key === 'Enter' || evt.key === ' ') {
      evt.preventDefault();
      // Trigger the click event
      evt.currentTarget.click();
    }
  };
  const commonProps = {
    role: onClick ? 'button' : undefined,
    tabIndex: onClick ? 0 : undefined,
    onKeyDown: onClick ? onKeyDown : undefined,
    onClick,
  };

  if (cornerIcon) {
    return (
      <i
        className={classNames(size, className, { link: !!onClick }, 'icons')}
        {...commonProps}
        {...other}
      >
        <i className={classNames(color, icon, 'icon')} />
        <i className={classNames(cornerIcon, 'corner icon')} />
      </i>
    );
  }

  return (
    <i
      className={classNames(color, size, icon, className, { link: !!onClick }, 'icon')}
      {...commonProps}
      {...other}
    />
  );
};

export default Icon;
