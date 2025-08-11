import * as React from 'react';

import classNames from 'classnames';
import Icon, { IconType } from '@/components/semantic/Icon';

import 'fomantic-ui-css/components/button.min.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconType;

  // Show spinner
  loading?: boolean;

  // Disable button (the button will be disabled automatically when 'loading' is true)
  disabled?: boolean;

  caption: React.ReactNode;

  inverted?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className,
  loading,
  icon,
  caption,
  disabled,
  color,
  inverted,
  ...other
}) => {
  const isDisabled = disabled || loading;
  const buttonStyle = classNames(
    'ui button',
    { disabled: isDisabled },
    { loading: !!loading },
    { inverted: !!inverted },
    color,
    className,
  );

  return (
    <button className={buttonStyle} {...other} disabled={isDisabled}>
      <Icon icon={icon} />
      {caption}
    </button>
  );
};

export default Button;
