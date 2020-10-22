'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import { InView } from 'react-intersection-observer';

import { UserMenu } from 'components/menu';

import * as API from 'types/api';

import MenuConstants from 'constants/MenuConstants';
import { CommonMessageProps } from '../types';
import { TimeStamp } from './Timestamp';
import { MessageText } from './MessageText';


interface AuthorProps {
  message: API.ChatMessage; 
  dropdownContext: string;
}

// Message sections
const Author: React.FC<AuthorProps> = ({ message, dropdownContext }) => (
  <div className="header author">
    { message.third_person && <span>*</span> }
    <UserMenu 
      contextElement={ dropdownContext } 
      triggerIcon={ null }
      user={ message.from }
      direction="downward"
      remoteMenuId={ MenuConstants.HUB_USER }
      entityId={ message.from.hub_session_id }
    />
  </div>
);

/*Author.propTypes = {
  message: PropTypes.object.isRequired,
  dropdownContext: PropTypes.string.isRequired,
};*/

interface ChatMessageProps extends CommonMessageProps {
  message: API.ChatMessage;
  dropdownContext: string;
}

// Main message types
class ChatMessage extends React.Component<ChatMessageProps> {
  static propTypes = {
    message: PropTypes.object.isRequired,
    dropdownContext: PropTypes.string.isRequired,
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { 
      message, dropdownContext, menuProps,
      ...other 
    } = this.props;

    return (
      <InView 
        className={ 'ui item chat ' + message.from.flags.join(' ')}
        { ...other }
      >
        <TimeStamp
          time={ message.time }
        />
        <div className={ 'left ' + (message.third_person ? 'third-person' : 'normal') }>
          <Author 
            message={ message } 
            dropdownContext={ dropdownContext }
          />
          <MessageText 
            message={ message }
            emojify={ true }
            user={ message.from }
            menuProps={ menuProps }
          />
        </div>
      </InView>
    );
  }
}

export { ChatMessage };
