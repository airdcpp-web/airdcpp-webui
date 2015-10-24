'use strict';

import React from 'react';
import LoginActions from 'actions/LoginActions'

import { Link } from 'react-router';

import OverlayDecorator from 'decorators/OverlayDecorator'

import '../style.css'

const settings = {
  context: '#main-layout'
};

const Sidebar = React.createClass({
  displayName: "Sidebar",
  componentDidMount() {
    this.props.showOverlay({
      context: '#main-layout',
      delaySetup: true
    });
  },

  render() {
    return (
      <div id="sidebar" className="ui right vertical overlay sidebar">
        <div id="sidebar-container">
            { this.props.children }
        </div>
      </div>
    );
  },
});

export default OverlayDecorator(Sidebar, "sidebar")
