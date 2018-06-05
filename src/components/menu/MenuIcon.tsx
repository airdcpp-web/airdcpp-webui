import PropTypes from 'prop-types';
import React from 'react';
import CountLabel from 'components/CountLabel';
import classNames from 'classnames';


interface MenuIconProps {
  className?: string;
  onClick: () => void;
  urgencies: object;
}

// A plain menu icon trigger for dropdowns (with urgency label support)
const MenuIcon: React.SFC<MenuIconProps> = ({ urgencies, className, onClick }) => (
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

MenuIcon.propTypes = {
  urgencies: PropTypes.object,
};

export default MenuIcon;
