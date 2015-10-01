'use strict';

import React from 'react';
import LoginActions from 'actions/LoginActions'
import { Link } from 'react-router';

import { SIDEBAR_ID } from 'constants/OverlayConstants'

//const logo = require('../../images/AirDCPlusPlus.png');

const MenuItem = React.createClass({
  render: function() {
    const state = {
        [SIDEBAR_ID]: {
          returnTo: this.props.location.pathname
        }
    };

    return (
      <Link to={this.props.page} className="item" state={state}>
        <i className={ this.props.icon + " icon" }></i>
        {this.props.title}
      </Link>
    );
  }
});

export default React.createClass({
  getChildContext: function () {
    return {
      pathname: this.props.location.pathname
    };
  },

  childContextTypes: {
    pathname: React.PropTypes.string.isRequired
  },


  render() {
    let tmp = this.props;
    return (
      <div className="ui labeled icon right fixed vertical inverted menu">
        <MenuItem location={this.props.location} icon="blue sitemap" title="Hubs" page="/sidebar/hubs"/>
        <MenuItem location={this.props.location} icon="blue comments" title="Messages" page="/sidebar/messages"/>
        <MenuItem location={this.props.location} icon="blue browser" title="Filelists" page="/sidebar/filelists"/>
      </div>
    );
  }
});
