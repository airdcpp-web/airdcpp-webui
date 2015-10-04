'use strict';

import React from 'react';
import Reflux from 'reflux';

import LoginActions from 'actions/LoginActions'
import { Link } from 'react-router';
import TransferStats from 'components/TransferStats'

import { SIDEBAR_ID } from 'constants/OverlayConstants'

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore'
import PrivateChatActions from 'actions/PrivateChatActions'

const MenuItem = React.createClass({
  render: function() {
    let state = this.props.location[SIDEBAR_ID];
    if (!state) {
      state = {
          [SIDEBAR_ID]: {
            returnTo: this.props.location.pathname
          }
      };
    }

    return (
      <Link to={this.props.page} className="item" state={state}>
        <i className={ this.props.icon + " icon" }></i>
        {this.props.title}
      </Link>
    );
  }
});

export default React.createClass({
  mixins: [Reflux.connect(PrivateChatSessionStore, "chatSessions")],
  displayName: "Side menu",
  getChildContext: function () {
    return {
      pathname: this.props.location.pathname
    };
  },

  componentWillMount() {
    PrivateChatActions.fetchSessions();
  },

  childContextTypes: {
    pathname: React.PropTypes.string.isRequired
  },


  render() {
    let tmp = this.props;
    return (
      <div id="side-menu">
        <div className="content">
          <div className="ui labeled icon vertical inverted menu">
            <MenuItem location={this.props.location} icon="blue sitemap" title="Hubs" page="/sidebar/hubs"/>
            <MenuItem location={this.props.location} icon="blue comments" title="Messages" page="/sidebar/messages"/>
            <MenuItem location={this.props.location} icon="blue browser" title="Filelists" page="/sidebar/filelists"/>
          </div>
        </div>
        <div>
          <TransferStats className="ui centered inverted mini list"/>
        </div>
      </div>
    );
  }
});


          //<TransferStats className="ui fixed right fixed vertical inverted menu"/>
