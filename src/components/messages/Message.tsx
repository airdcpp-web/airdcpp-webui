'use strict';
import PropTypes from 'prop-types';
import React from 'react';

import TextDecorator from 'components/TextDecorator';
import { formatTimestamp } from 'utils/ValueFormat';

import Icon from 'components/semantic/Icon';
import IconConstants from 'constants/IconConstants';
//import { SeverityEnum } from 'constants/EventConstants';

import { UserMenu } from 'components/menu';

import * as API from 'types/api';
import MenuConstants from 'constants/MenuConstants';


interface AuthorProps {
  message: API.ChatMessage; 
  dropdownContext: string;
  entityId: API.IdType;
}

// Message sections
const Author: React.FC<AuthorProps> = ({ message, dropdownContext, entityId }) => (
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

interface TimeStampProps {
  message: API.Message;
}

const TimeStamp: React.FC<TimeStampProps> = ({ message }) => (
  <div className="time">
    { formatTimestamp(message.time) }
  </div>
);

interface MessageTextProps {
  message: API.Message; 
  emojify: boolean;
}

const MessageText: React.FC<MessageTextProps> = ({ message, emojify }) => (
  <div className="text">
    <TextDecorator
      emojify={ emojify }
      text={ message.text }
    />
  </div>
);

/*MessageText.propTypes = {
  message: PropTypes.object.isRequired,
  emojify: PropTypes.bool.isRequired,
};*/


interface ChatMessageProps {
  message: API.ChatMessage;
  dropdownContext: string;
  entityId: API.IdType;
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
    const { message, dropdownContext, entityId } = this.props;
    return (
      <div className={ 'ui item chat ' + message.from.flags.join(' ')}>
        <TimeStamp 
          message={ message }
        />
        <div className={ 'left ' + (message.third_person ? 'third-person' : 'normal') }>
          <Author 
            message={ message } 
            dropdownContext={ dropdownContext }
            entityId={ entityId }
          />
          <MessageText 
            message={ message }
            emojify={ true }
          />
        </div>
      </div>
    );
  }
}

const getSeverityIcon = (severity: API.SeverityEnum) => {
  switch (severity) {
    case API.SeverityEnum.INFO: return IconConstants.INFO + ' circle';
    case API.SeverityEnum.WARNING: return IconConstants.WARNING;
    case API.SeverityEnum.ERROR: return IconConstants.ERROR;
    default: return '';
  }
};

interface StatusMessageProps {
  message: API.StatusMessage;
}

class StatusMessage extends React.Component<StatusMessageProps> {
  static propTypes = {
    message: PropTypes.object.isRequired,
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { message } = this.props;
    return (
      <div className={ 'ui item status ' + message.severity }>
        <Icon icon={ getSeverityIcon(message.severity) }/>
        { message.time > 0 && <TimeStamp message={ message }/> }
        <MessageText 
          message={ message }
          emojify={ false }
        />
      </div>
    );
  }
}

export { ChatMessage, StatusMessage };
