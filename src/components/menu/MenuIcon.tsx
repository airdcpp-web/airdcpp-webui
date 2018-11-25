//import PropTypes from 'prop-types';
import React from 'react';
import CountLabel, { CountLabelProps } from 'components/CountLabel';
import classNames from 'classnames';


interface MenuIconProps extends Pick<CountLabelProps, 'urgencies'> {
  className?: string;
  onClick?: () => void;
}

// A plain menu icon trigger for dropdowns (with urgency label support)
const MenuIcon: React.FC<MenuIconProps> = ({ urgencies, className, onClick }) => (
  <div className={ classNames('icon-menu', className) }> 
    <i className="content link icon" onClick={ onClick }/>
    <CountLabel 
      urgencies={ urgencies }
      size="mini"
      empty={ true }
      circular={ true }
    />
  </div>
);

/*MenuIcon.propTypes = {
  urgencies: PropTypes.object,
};*/

export { MenuIcon };
