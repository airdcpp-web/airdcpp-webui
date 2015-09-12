'use strict';

import React from 'react';
import LoginActions from '../actions/LoginActions'
import { Link } from 'react-router';

export default class Navigation extends React.Component {
  constructor() {
    super()
  }

  setActiveMenuItem(uid) {
    this.setState({activeItem: uid});
  }

  render() {
    var MenuItem = React.createClass({
      render: function() {
        return (
          <Link to={this.props.page} className="item">
            {this.props.title}
          </Link>
        );
      }
    });

    return (
      <div className="ui fixed inverted menu">
        <div className="ui container">
          <div href="#" className="header item">
            <img className="logo" src="images/AirDCPlusPlus.png"/>
          </div>
          <div className="item right">
            <MenuItem title="Home" page=""/>
            <MenuItem title="Queue" page="queue"/>
            <MenuItem title="Search" page="search"/>
            <a className="item" href="" onClick={this.logout}>
              Logout
            </a>
          </div>
        </div>
      </div>
    );
  }

  logout(e) {
    e.preventDefault();
    LoginActions.logout();
  }
}
