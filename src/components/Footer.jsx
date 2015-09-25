import React from 'react';
import Reflux from 'reflux';

import TransferStatsStore from '../stores/TransferStatsStore'
import LogStore from '../stores/LogStore'

import LogActions from '../actions/LogActions';
import SystemLog from './SystemLog'

import Format from '../utils/Format.js'
import { Button, Icon } from 'react-semantify'
import Popup from './semantic/Popup'
import StoreLoaderMixin from '../mixins/StoreLoaderMixin';


const SpeedDisplay = React.createClass({
  render: function() {
    return (
      <div className="item">
        <i className={this.props.type + ' icon'}></i>
        <div className="content">
          <div className="header">{ Format.formatSpeed(this.props.speed, Format) }</div>
        </div>
      </div>
    );
  }
});

const LogIcon = React.createClass({
  render: function() {
    if (this.props.count == 0) {
      return null;
    }

    return (
      <div className="item">
        <i className={this.props.type + ' icon'}></i>
        <div className="content">
          <div className="header">{ this.props.count }</div>
        </div>
      </div>
    );
  }
});

const LogBar = React.createClass({
  mixins: [Reflux.connect(LogStore), StoreLoaderMixin(LogStore)],
  componentDidMount: function() {
    LogActions.fetchLastMessages();
  },

  render: function() {
    const style = {
      maxHeight: 300 + 'px', 
      overflowY: 'auto'
    };

    return (
      <div className="item left">
        <Popup ref="systemLogPopup" trigger= { <Button className="syslog ui button">System log</Button> }>
          <SystemLog log_messages={ this.state.log_messages }/>
        </Popup>
        <LogIcon type="blue info circle" count={ this.state.log_counters.log_info }/>
        <LogIcon type="yellow warning sign" count={ this.state.log_counters.log_warnings }/>
        <LogIcon type="red warning circle" count={ this.state.log_counters.log_errors }/>
      </div>
    );
  }
});

const StatisticsBar = React.createClass({
  mixins: [Reflux.connect(TransferStatsStore), StoreLoaderMixin(TransferStatsStore)],
  render: function() {
    return (
      <div className="item right">
        <SpeedDisplay type="green download" speed={ this.state.statistics.speed_down }/>
        <SpeedDisplay type="red upload" speed={ this.state.statistics.speed_up }/>
      </div>
    );
  }
});

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="ui bottom fixed inverted menu">
        <div className="ui container">
            <LogBar/>
            <StatisticsBar/>
        </div>
      </div>
    );
  }

};