//import PropTypes from 'prop-types';
import React from 'react';

import classNames from 'classnames';
import Icon, { IconType } from 'components/semantic/Icon';

import 'semantic-ui-css/components/button.min.css';


export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconType;
  loading?: boolean;
  disabled?: boolean;
  caption: React.ReactNode;
  tag?: string;
  semanticClassName?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  className, loading, icon, caption, disabled, 
  tag = 'button', semanticClassName = 'ui button', ...other 
}) => {
  const buttonStyle = classNames(
    semanticClassName,
    { 'disabled': !!disabled || !!loading },
    { 'loading': !!loading },
    className,
  );

  return React.createElement(
    tag,
    {
      className: buttonStyle, 
       ...other
    },
    (
      <>
        <Icon icon={ icon }/>
        { caption }
      </>
    )
  );
  /*return (
    <tag 
      className={ buttonStyle } 
      { ...other }
    >
      <Icon icon={ icon }/>
      { caption }
    </tag>
  );*/
};

/*Button.propTypes = {
  // Icon class
  icon: PropTypes.string,

  // Button caption
  caption: PropTypes.node.isRequired,

  // Disable button (the button will be disabled automatically when 'loading' is true)
  disabled: PropTypes.bool,

  // Show spinner
  loading: PropTypes.bool,
};*/

export default Button;
