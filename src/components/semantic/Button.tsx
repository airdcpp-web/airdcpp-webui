import PropTypes from 'prop-types';
import React from 'react';

import classNames from 'classnames';
import Icon, { IconType } from 'components/semantic/Icon';

import 'semantic-ui/components/button.min.css';


export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: IconType;
  loading?: boolean;
  disabled?: boolean;
  caption: React.ReactNode;
  //cornerIcon: string;
  //size: string;
}

const Button: React.SFC<ButtonProps> = ({ className, loading, icon, caption, disabled, ...other }) => {
  const buttonStyle = classNames(
    'ui button',
    { 'disabled': !!disabled || !!loading },
    { 'loading': !!loading },
    className,
  );

  return (
    <button 
      className={ buttonStyle } 
      { ...other }
    >
      <Icon icon={ icon }/>
      { caption }
    </button>
  );
};

Button.propTypes = {
  /**
	 * Icon class
	 */
  icon: PropTypes.string,

  /**
	 * Button caption
	 */
  caption: PropTypes.node.isRequired,

  /**
	 * Disable button (the button will be disabled automatically when 'loading' is true)
	 */
  disabled: PropTypes.bool,

  /**
	 * Show spinner
	 */
  loading: PropTypes.bool,
};

export default Button;
