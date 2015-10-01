'use strict';

import React from 'react';
import LoginStore from 'stores/LoginStore'
import Reflux from 'reflux';
import Footer from './Footer'
import NavigationPanel from './Navigation'
import SocketService from 'services/SocketService'
import LoginActions from 'actions/LoginActions'
import Notifications from './Notifications'
import SideMenu from './SideMenu'
import OverlayDecorator from 'decorators/OverlayDecorator'
import { SIDEBAR_ID } from 'constants/OverlayConstants'

import { History } from 'react-router';
import { Dimmer, Loader } from 'react-semantify'
import { RouteContext } from 'react-router'

const SocketConnectStatus = React.createClass({
  render() {
    let message;
    if (this.props.lastError !== null) {
      message = this.props.lastError + ". Reconnecting...";
    } else {
      message = "Connecting to the server...";
    }

    return (
      <Dimmer className="page visible" active={ this.props.active }>
        <div className="content">
          <div className="center">
            <div className="ui text loader">
              {message}
            </div>
          </div>
        </div>
      </Dimmer>
    );
  }
});

const MainLayout = React.createClass({
  getInitialState() {
    return this.getViewState();
  },

  getViewState() {
    return { 
      viewport: {
        width: window.innerWidth, 
        height: window.innerHeight
      }
    }
  },

  onViewResized() {
    this.setState(this.getViewState());
  },

  componentDidMount() {
    window.addEventListener('resize', this.onViewResized);
  },

  render() {
    let tmp = this.props;
    return (
      <div className={this.props.className} id={this.props.id}>
        <div id="sidebar" className="ui right vertical overlay sidebar"/>
        <div className="pusher">
          <Notifications/>
          <NavigationPanel/>
          <div className="ui container main" style={{ height: Math.max(300, this.state.viewport.height) + 'px', paddingTop: '80px', paddingBottom: '80px'}}>
           {this.props.children}
          </div>
          <Footer/>
        </div>
      </div>
    );
  }
});

const AuthenticatedApp = React.createClass({
  mixins: [Reflux.connect(LoginStore), History, RouteContext],

  /*getInitialState() {
    return this.getViewState();
  },

  getViewState() {
    return { 
      viewport: {
        width: window.innerWidth, 
        height: window.innerHeight
      }
    }
  },

  onViewResized() {
    this.setState(this.getViewState());
  },

  componentDidMount() {
    window.addEventListener('resize', this.onViewResized);
  },*/

  componentWillUpdate(nextProps, nextState) {
    if (nextState.userLoggedIn && this.state.socketAuthenticated && !nextState.socketAuthenticated) {
      // Reconnect (but not too fast)
      console.log("Socket closed, attempting to reconnect in 2 seconds");
      setTimeout(() => LoginActions.connect(this.state.token), 2000);
    } else if (this.state.userLoggedIn && !nextState.userLoggedIn) {
      this.history.replaceState(null, '/login');
    }
  },

  componentWillReceiveProps(nextProps) {
    // if we changed routes...
    if ((
      nextProps.location.key !== this.props.location.key &&
      nextProps.location.state &&
      nextProps.location.state[SIDEBAR_ID]
    )) {
      // save the old children (just like animation)
      this.previousChildren = this.props.children
    }
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.onViewResized);
  },

  render() {
    if (this.state.socketAuthenticated) {
      let isSidebar = (
        this.props.location.state &&
        this.props.location.state[SIDEBAR_ID] &&
        this.previousChildren
      )

      return (
        <div id="authenticated-app">
          
          <SideMenu id="side-menu" location={ this.props.location }/>
          <MainLayout id="main-layout" className="pushable" location={ this.props.location }>
            {isSidebar ?
              this.previousChildren :
              this.props.children
            }
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

export default OverlayDecorator(AuthenticatedApp, SIDEBAR_ID, "sidebar");