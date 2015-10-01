'use strict';

import React from 'react';
import LoginActions from 'actions/LoginActions'

import { Link } from 'react-router';
import { Lifecycle } from 'react-router'

import '../style.css'

export default React.createClass({
  mixins: [ Lifecycle ],
  routerWillLeave(nextLocation) {
    this.hide();
  },

  propTypes: {
    /**
     * Removes portal from DOM and redirects previous path
     * Should usually be passed from ChildModalMixin
     */
    closeHandler: React.PropTypes.func.isRequired
  },

  componentDidMount() {
    const settings = {
      onHidden: this.onHidden,
      context: '#main-layout'
    };

    let dom = React.findDOMNode(this);
    $('#authenticated-app .sidebar').sidebar(settings).sidebar('show');
  },

  hide() {
    let dom = React.findDOMNode(this);
    $('#authenticated-app .sidebar').sidebar('hide');
  },

  onHidden() {
    this.props.closeHandler();
  },

  render() {
    /*const MenuItem = React.createClass({
      render: function() {
        return (
          <Link to={this.props.page} className="item">
            <i className={ this.props.icon + " icon" }></i>
            {this.props.title}
          </Link>
        );
      }
    });*/

    return (
      <div>
        { this.props.children }
      </div>
    );
  }
});
