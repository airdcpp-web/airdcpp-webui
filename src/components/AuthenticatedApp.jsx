'use strict';

import React from 'react';
import LoginStore from '../stores/LoginStore'
import Reflux from 'reflux';
import Footer from './Footer'
import NavigationPanel from './Navigation'
import SocketService from '../services/SocketService'
import LoginActions from '../actions/LoginActions'
import { Navigation } from 'react-router';
import { Dimmer, Loader } from 'react-semantify'

var SocketConnectStatus = React.createClass({
  render() {
    var message;
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

export default React.createClass({
  mixins: [Reflux.connect(LoginStore), Navigation],

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

  componentWillUpdate(nextProps, nextState) {
    if (nextState.userLoggedIn && this.state.socketAuthenticated && !nextState.socketAuthenticated) {
      // Reconnect (but not too fast)
      setTimeout(LoginActions.connect(this.state.token), 1000);
    } else if (this.state.userLoggedIn && !nextState.userLoggedIn) {
      //SocketService.disconnect();
      this.replaceWith('/login');
    }
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.changeListener);
  },

  render() {
    if (this.state.socketAuthenticated) {
      return (
        <div>
          <NavigationPanel/>
          <div className="ui container" style={{ height: Math.max(300, this.state.viewport.height - 160) + 'px', paddingTop: '80px'}}>
           {this.props.children}
          </div>
          <Footer/>
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