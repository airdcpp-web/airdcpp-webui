'use strict';
import React from 'react';
import Reflux from 'reflux';

import LoginActions from 'actions/LoginActions'
import LoginStore from 'stores/LoginStore'
import SocketService from 'services/SocketService'

import Notifications from './Notifications'

import NavigationPanel from './Navigation'
import SideMenu from './SideMenu'

import OverlayParentDecorator from 'decorators/OverlayParentDecorator'
import { SIDEBAR_ID } from 'constants/OverlayConstants'

import { History, RouteContext } from 'react-router';

const SocketConnectStatus = React.createClass({
  render() {
    let message;
    if (this.props.lastError !== null) {
      message = this.props.lastError + ". Reconnecting...";
    } else {
      message = "Connecting to the server...";
    }

    return (
      <div className={ "ui dimmer page visible " + (this.props.active ? "active" : "")}>
        <div className="content">
          <div className="center">
            <div className="ui text loader">
              {message}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

let MainLayout = React.createClass({
  showSideBar(props) {
    return props.location.state &&
      props.location.state[SIDEBAR_ID];
  },

  componentWillReceiveProps(nextProps) {
    if (this.showSideBar(nextProps)) {
      if (!this.previousChildren) {
        // save the old children (just like animation)
        this.previousChildren = this.props.children
      }
    } else {
      this.previousChildren = null;
    }
  },

  render() {
    let sidebar = null;
    if (this.showSideBar(this.props)) {
      sidebar = this.props.getOverlay(this.props);
    }

    return (
      <div className={this.props.className} id={this.props.id}>
          { sidebar }
        <div className="pusher">
          <Notifications/>
          <NavigationPanel/>
          <div className="ui container main" style={{ height: '100%', paddingTop: '80px'}}>
            {sidebar ?
              this.previousChildren :
              this.props.children
            }
          </div>
        </div>
      </div>
    );
  }
});

MainLayout = OverlayParentDecorator(MainLayout, SIDEBAR_ID, false);

const AuthenticatedApp = React.createClass({
  mixins: [Reflux.connect(LoginStore), History, RouteContext],

  componentWillUpdate(nextProps, nextState) {
    if (nextState.userLoggedIn && this.state.socketAuthenticated && !nextState.socketAuthenticated) {
      // Reconnect (but not too fast)
      console.log("Socket closed, attempting to reconnect in 2 seconds");
      setTimeout(() => LoginActions.connect(this.state.token), 2000);
    } else if (this.state.userLoggedIn && !nextState.userLoggedIn) {
      // Logged out
      this.history.replaceState(null, '/login');
    }
  },

  render() {
    if (this.state.socketAuthenticated) {
      return (
        <div id="authenticated-app">
          
          <SideMenu id="side-menu" location={ this.props.location }/>
          <MainLayout id="main-layout" className="pushable" location={ this.props.location }>
            { this.props.children }
          </MainLayout>
        </div>
      );
    } else {
      // Dim the screen until the server can be reached (we can't do anything without the socket)
      return(
        <SocketConnectStatus active={true} lastError={this.state.lastError}/>
      );
    }
  }
});

export default AuthenticatedApp;