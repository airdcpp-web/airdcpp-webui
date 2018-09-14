'use strict';
import PropTypes from 'prop-types';
import React from 'react';

import TextDecorator from 'components/TextDecorator';
import { formatTimestamp } from 'utils/ValueFormat';

import Icon from 'components/semantic/Icon';
import IconConstants from 'constants/IconConstants';
//import { SeverityEnum } from 'constants/EventConstants';

import { UserMenu } from 'components/menu/DropdownMenu';


// Message sections
const Author: React.SFC<{ message: API.ChatMessage; dropdownContext: string }> = ({ message, dropdownContext }) => (
  <div className="header author">
    { message.third_person && <span>*</span> }
    <UserMenu 
      contextElement={ dropdownContext } 
      triggerIcon={ null }
      user={ message.from }
      direction="downward"
    />
  </div>
);

/*Author.propTypes = {
  message: PropTypes.object.isRequired,
  dropdownContext: PropTypes.string.isRequired,
};*/

const TimeStamp: React.SFC<{ message: API.Message }> = ({ message }) => (
  <div className="time">
    { formatTimestamp(message.time) }
  </div>
);

const MessageText: React.SFC<{ message: API.Message, emojify: boolean }> = ({ message, emojify }) => (
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
    const { message, dropdownContext } = this.props;
    return (
      <div className={ 'ui item chat ' + message.from.flags.join(' ')}>
        <TimeStamp 
          message={ message }
        />
        <div className={ 'left ' + (message.third_person ? 'third-person' : 'normal') }>
          <Author 
            message={ message } 
            dropdownContext={ dropdownContext }
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


const getSeverityIcon = (severity: API.Severity) => {
  switch (severity) {
    case API.Severity.INFO: return IconConstants.INFO + ' circle';
    case API.Severity.WARNING: return IconConstants.WARNING;
    case API.Severity.ERROR: return IconConstants.ERROR;
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
