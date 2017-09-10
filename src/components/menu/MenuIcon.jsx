import PropTypes from 'prop-types';
import React from 'react';
import CountLabel from 'components/CountLabel';


// A plain menu icon trigger for dropdowns (with urgency label support)
const MenuIcon = ({ urgencies, className = '', onClick }) => (
  <div className={ 'icon-menu ' + className }> 
    <i className="content link icon" onClick={onClick}/>
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
