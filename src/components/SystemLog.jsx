import React from 'react';
import Format from '../utils/Format.js'
import LogActions from '../actions/LogActions'
import { Button, Popup, Icon, Header, Table, Grid, Row, Column } from 'react-semantify'

var LogMessage = React.createClass({
  render: function() {
    var iconClass;
    switch(this.props.message.severity) {
      case 0: iconClass = 'blue info circle'; break;
      case 1: iconClass = 'yellow warning sign'; break;
      case 2: iconClass = 'red warning circle'; break;
    }

    return (
      <Row className="message">
        <Column className="one wide">
          <Icon className={ iconClass }/>
        </Column>
        <Column className="twelve wide">
          { this.props.message.text }
        </Column>
        <Column className="three wide">
          { Format.formatTimestamp(this.props.message.time) }
        </Column>
      </Row>
    );
  }
});

export default React.createClass({
  componentWillMount: function() {
    LogActions.resetLogCounters();
  },

  componentWillUpdate: function() {
    var node = React.findDOMNode(this.refs.messageList);
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  },
   
  componentDidUpdate: function() {
    if (this.shouldScrollBottom) {
      var node = React.findDOMNode(this.refs.messageList);
      node.scrollTop = node.scrollHeight
    }
  },

  render: function() {
    var messageList = this.props.log_messages.map(function (message) {
      return (
        <LogMessage key={ message.id } message={message}/>
      );
    });

    return (
      <div className="systemlogBox">
        <Header>System log</Header>
        <Grid ref="messageList" className="messageList three column divided" style={{maxHeight: 300 + 'px', overflowY: 'auto'}}>
          {messageList}
        </Grid>
      </div>
    );
  }
});