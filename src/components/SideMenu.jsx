'use strict';

import React from 'react';
import Reflux from 'reflux';

import History from 'utils/History'
import LoginActions from 'actions/LoginActions'
import { Link } from 'react-router';
import TransferStats from 'components/TransferStats'

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore'
import PrivateChatActions from 'actions/PrivateChatActions'

const MenuItem = React.createClass({
  onClick: function(evt) {
    evt.preventDefault();

    History.pushSidebar(this.props.location, this.props.page);
  },

  render: function() {
    return (
      <Link to={this.props.page} className="item" onClick={this.onClick}>
        { this.props.labelCount > 0 ? (
          <div className={ "ui mini label " + this.props.labelColor}> { this.props.labelCount } </div>
          ) : null }
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
            <MenuItem labelCount={ 0 } labelColor="red" location={this.props.location} icon="blue sitemap" title="Hubs" page="hubs"/>
            <MenuItem labelCount={ PrivateChatSessionStore.countUnreadSessions() } labelColor="red" location={this.props.location} icon="blue comments" title="Messages" page="messages"/>
            <MenuItem labelCount={ 0 } location={this.props.location} icon="blue browser" title="Filelists" page="filelists"/>
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
