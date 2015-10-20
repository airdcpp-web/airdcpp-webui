import React from 'react';
import Reflux from 'reflux';

import Format from 'utils/Format.js'
import LogActions from 'actions/LogActions'
import LogStore from 'stores/LogStore'

import NewLayout from 'routes/Sidebar/components/NewLayout'
import TabHeader from 'routes/Sidebar/components/TabHeader'

import ScrollDecorator from 'decorators/ScrollDecorator'

import '../style.css'

const LogMessage = React.createClass({
  render: function() {
    let iconClass;
    switch(this.props.message.severity) {
      case 0: iconClass = 'blue info circle'; break;
      case 1: iconClass = 'yellow warning sign'; break;
      case 2: iconClass = 'red warning circle'; break;
    }

    return (
      <div className="ui row log-message">
        <div className="ui column one wide">
          <i className={ iconClass + " icon" }></i>
        </div>
        <div className="ui column thirteen wide">
          { this.props.message.text }
        </div>
        <div className="ui column two wide">
          { Format.formatTimestamp(this.props.message.time) }
        </div>
      </div>
    );
  }
});

const SystemLog = ScrollDecorator(React.createClass({
  mixins: [Reflux.ListenerMixin],
  componentWillMount: function() {
    LogActions.messagesRead();
    this.listenTo(LogStore, this._onMessagesUpdated);
  },

  getInitialState() {
    return {
      messages: LogStore.logMessages
    }
  },

  _onMessagesUpdated(messages) {
    LogActions.messagesRead();
    this.setState({messages: messages});
  },

  render: function() {
    if (this.state.messages.length === 0) {
      return <div>No messages to show</div>
    }

    const messageList = this.state.messages.map(function (message) {
      return (
        <LogMessage key={ message.id } message={message}/>
      );
    });

    return (
      <div className="ui segment system-log">
        <div ref="messageList" className="ui grid message-list three column divided">
          {messageList}
        </div>
      </div>
    );
  }
}));

const SimpleSidebarLayout = React.createClass({
  _handleClear() {
    LogActions.clear();
  },

  render: function() {
    return (
      <div className="simple-layout">
        <div className="ui segment">
          <TabHeader
            icon={ <i className="blue history icon"></i> }
            title="Events"
            buttonClickHandler={this._handleClear}
            buttonCaption="Clear"/>

          <div className="content">
            <SystemLog/>
          </div>
        </div>
      </div>
    );
  }
});

export default SimpleSidebarLayout