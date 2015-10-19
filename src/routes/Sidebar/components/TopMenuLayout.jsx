import React from 'react';

import SessionManagerDecorator from 'routes/Sidebar/decorators/SessionManagerDecorator'
import Dropdown from 'components/semantic/Dropdown'

const SideMenuLayout = React.createClass({
  propTypes: {
    /**
     * Location object
     */
    location: React.PropTypes.object.isRequired,
  },

  render() {
    return (
      <div className="top-menu-layout">
      	<div className="ui main menu menu-bar">
	      	<Dropdown className="icon item">
	      	  <i className="content icon"></i>
	      	  <div className="menu">
	      	  	<div className="header">New</div>
	      	  	{ this.props.newButton }
	      	  	<div className="ui divider"></div>
	      	  	<div className="header">Existing</div>
	      	  	{ this.props.menuItems }
	      	  </div>
	      	</Dropdown>
	      	<div className="item">
	      		Filelists
	      	</div>
      	</div>
      	<div className="session-layout">
          { this.props.children }
        </div>
      </div>
    );
  }
});

export default SessionManagerDecorator(SideMenuLayout);