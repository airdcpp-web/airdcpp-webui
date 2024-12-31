import * as React from 'react';

import classNames from 'classnames';

import 'fomantic-ui-css/components/button.min.css';

export interface LinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Disable button (the button will be disabled automatically when 'loading' is true)
  disabled?: boolean;

  caption: React.ReactNode;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  className,
  caption,
  disabled,
  color = 'blue',
  ...other
}) => {
  const buttonStyle = classNames(
    'ui button basic link',
    { disabled: !!disabled },
    color,
    className,
  );

  return (
    <button className={buttonStyle} {...other}>
      {caption}
    </button>
  );
};

export default LinkButton;
