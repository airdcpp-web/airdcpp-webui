'use strict';

import React from 'react';
import LoginActions from 'actions/LoginActions'
import { Link } from 'react-router';

const logo = require('../../images/AirDCPlusPlus.png');

export default class Navigation extends React.Component {
  constructor() {
    super()
  }

  setActiveMenuItem(uid) {
    this.setState({activeItem: uid});
  }

  render() {
    const MenuItem = React.createClass({
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
            <img className="logo" src={ logo }/>
          </div>
          <div className="item right">
            <MenuItem title="Home" page="/"/>
            <MenuItem title="Favorites" page="/favorite-hubs"/>
            <MenuItem title="Queue" page="/queue"/>
            <MenuItem title="Search" page="/search"/>
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
