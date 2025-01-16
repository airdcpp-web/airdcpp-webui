import * as React from 'react';

import classNames from 'classnames';
import Icon, { IconType } from './Icon';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  React.PropsWithChildren<{
    icon?: IconType;
  }>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { icon, className, disabled, children, ...other },
  ref,
) {
  const inputClassName = classNames(
    'ui input',
    { disabled: !!disabled },
    { 'left icon': !!icon },
    { action: !!children },
    className,
  );

  return (
    <div className={inputClassName}>
      <Icon icon={icon} />
      <input ref={ref} {...other} />
      {children}
    </div>
  );
});

export default Input;
