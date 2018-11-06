'use strict';
//import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import { loadSessionProperty, saveSessionProperty, useMobileLayout } from 'utils/BrowserUtils';
import ChatCommandHandler from './ChatCommandHandler';

//@ts-ignore
import { MentionsInput, Mention } from 'react-mentions';

import UserConstants from 'constants/UserConstants';
import SocketService from 'services/SocketService';
import { ChatSessionProps } from 'routes/Sidebar/components/chat/ChatLayout';

import * as API from 'types/api';
import { ErrorResponse } from 'airdcpp-apisocket';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const ENTER_KEY_CODE = 13;


const getMentionFieldStyle = (mobileLayout: boolean) => {
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

export interface MessageComposerProps extends ChatSessionProps {

}



const getStorageKey = (props: RouteComponentProps) => {
  return 'last_message_' + props.location.pathname;
};

const loadState = (props: RouteComponentProps) => {
  return {
    text: loadSessionProperty(getStorageKey(props), ''),
  };
};


const saveState = (state: State, props: RouteComponentProps) => {
  saveSessionProperty(getStorageKey(props), state.text);
};

const userToMention = (user: API.HubUser) => {
  return {
    id: user.cid,
    display: user.nick,
  };
};

interface State {
  text: string;
}

class MessageComposer extends React.Component<MessageComposerProps & RouteComponentProps> {
  /*static propTypes = {
    // Actions for this chat session type
    actions: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
  };*/

  handleCommand = (text: string) => {
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
  }

  handleSend = (text: string) => {
    const { actions, session } = this.props;
    actions.sendMessage(session, text);
  }

  componentWillUnmount() {
    saveState(this.state, this.props);
  }

  componentDidUpdate(prevProps: RouteComponentProps, prevState: State) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      saveState(prevState, prevProps);
      this.setState(loadState(this.props));
    }
  }

  handleChange = (event: any, markupValue: string, plainValue: string) => {
    this.setState({ 
      text: plainValue 
    });
  }

  onKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode === ENTER_KEY_CODE && !event.shiftKey) {
      event.preventDefault();
      this.sendText();
    }
  }

  sendText = () => {
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
  }

  findUsers = (value: string, callback: (data: any) => void) => {
    const { session } = this.props;
    SocketService.post(UserConstants.SEARCH_NICKS_URL, { 
      pattern: value, 
      max_results: 5,
      hub_urls: session.hub_url ? [ session.hub_url ] : undefined,
    })
      .then((users: API.HubUser[]) => callback(users.map(userToMention)))
      .catch((error: ErrorResponse) => 
        console.log(`Failed to fetch suggestions: ${error}`)
      );
  }

  state: State = loadState(this.props);

  render() {
    const mobile = useMobileLayout();
    const className = classNames(
      'ui form composer',
      { 'small': mobile },
      { 'large': !mobile },
    );

    return (
      <div className={ className }>
        <MentionsInput 
          className="input"
          value={ this.state.text } 
          onChange={ this.handleChange }
          onKeyDown={ this.onKeyDown }
          style={ getMentionFieldStyle(mobile) }
          autoFocus={ true }
        >
          <Mention 
            trigger="@"
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
  }
}

const Decorated = withRouter(MessageComposer);

export default Decorated;