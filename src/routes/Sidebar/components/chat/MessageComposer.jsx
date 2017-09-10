'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import BrowserUtils from 'utils/BrowserUtils';
import ChatCommandHandler from './ChatCommandHandler';
import { MentionsInput, Mention } from 'react-mentions';

import UserConstants from 'constants/UserConstants';
import SocketService from 'services/SocketService';

const ENTER_KEY_CODE = 13;


const getMentionFieldStyle = (mobileLayout) => {
  return {
    suggestions: {
      list: {
        width: 200,
        overflow: 'auto',
        position: 'absolute',
        bottom: 3,
        left: 17,
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.15)',
        fontSize: 10,
      },

      item: {
        padding: '5px 15px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',

        '&focused': {
          background: 'rgba(0,0,0,.03)',
          color: 'rgba(0,0,0,.95)',
        },
      },
    },
    input: {
      minHeight: !mobileLayout ? 63 : 0,
      maxHeight: 200,
    },
  };
};

const MessageComposer = React.createClass({
  propTypes: {
    /**
		 * Actions for this chat session type
		 */
    actions: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
  },

  contextTypes: {
    routerLocation: PropTypes.object.isRequired,
  },

  handleCommand(text) {
    let command, params;

    {
      // Parse the command
      const whitespace = text.indexOf(' ');
      if (whitespace === -1) {
        command = text.substr(1);
      } else {
        command = text.substr(1, whitespace - 1);
        params = text.substr(whitespace + 1);
      }
    }

    ChatCommandHandler(this.props).handle(command, params);
  },

  handleSend(message) {
    const { actions, session } = this.props;
    actions.sendMessage(session, message);
  },

  getStorageKey(context) {
    return 'last_message_' + context.routerLocation.pathname;
  },

  saveText() {
    const { text } = this.state;
    BrowserUtils.saveSessionProperty(this.getStorageKey(this.context), text);
  },

  loadState(context) {
    return {
      text: BrowserUtils.loadSessionProperty(this.getStorageKey(context), ''),
    };
  },

  getInitialState() {
    return this.loadState(this.context);
  },

  componentWillUnmount() {
    this.saveText();
  },

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.routerLocation.pathname !== this.context.routerLocation.pathname) {
      this.saveText();
      this.setState(this.loadState(nextContext));
    }
  },

  handleChange(event, markupValue, plainValue) {
    this.setState({ 
      text: plainValue 
    });
  },

  onKeyDown(event) {
    if (event.keyCode === ENTER_KEY_CODE && !event.shiftKey) {
      event.preventDefault();
      this.sendText();
    }
  },

  sendText() {
    // Trim only from end to allow chat messages such as " +help" to be
    // sent to other users
    // This will also prevent sending empty messages
    const text = this.state.text.replace(/\s+$/, '');

    if (text) {
      if (text[0] === '/') {
        this.handleCommand(text);
      }

      this.handleSend(text);
    }

    this.setState({ text: '' });
  },

  mapUser(user) {
    return {
      id: user.cid,
      display: user.nick,
    };
  },

  findUsers(value, callback) {
    const { session } = this.props;
    SocketService.post(UserConstants.SEARCH_NICKS_URL, { 
      pattern: value, 
      max_results: 5,
      hub_urls: session.hub_url ? [ session.hub_url ] : undefined,
    })
      .then(users => callback(users.map(this.mapUser)))
      .catch(error => 
        console.log('Failed to fetch suggestions: ' + error)
      );
  },

  render: function () {
    const mobile = BrowserUtils.useMobileLayout();
    const className = classNames(
      'ui form composer',
      { 'small': mobile },
      { 'large': !mobile },
    );

    return (
      <div className= { className }>
        <MentionsInput 
          className="input"
          value={ this.state.text } 
          onChange={ this.handleChange }
          onKeyDown={ this.onKeyDown }
          style={ getMentionFieldStyle(mobile) }
        >
          <Mention trigger="@"
            data={ this.findUsers }
            appendSpaceOnAdd={ false }
          />
        </MentionsInput>
        <div 
          className="blue large ui icon send button" 
          onClick={ this.sendText }
        >
          <i className="send icon"/>
        </div>
      </div>
    );
  },
});

export default MessageComposer;