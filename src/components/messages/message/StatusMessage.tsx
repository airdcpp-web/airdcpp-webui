import PropTypes from 'prop-types';

import classNames from 'classnames';
import { Component } from 'react';
import { InView } from 'react-intersection-observer';

import Icon from 'components/semantic/Icon';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';

import { CommonMessageProps } from '../types';
import { MessageText } from './MessageText';
import { TimeStamp } from './Timestamp';

const getSeverityIcon = (severity: API.SeverityEnum) => {
  switch (severity) {
    case API.SeverityEnum.VERBOSE:
      return IconConstants.VERBOSE;
    case API.SeverityEnum.INFO:
      return IconConstants.INFO + ' circle';
    case API.SeverityEnum.WARNING:
      return IconConstants.WARNING;
    case API.SeverityEnum.ERROR:
      return IconConstants.ERROR;
    default:
      return '';
  }
};

interface StatusMessageProps extends CommonMessageProps {
  message: API.StatusMessage;
}

class StatusMessage extends Component<StatusMessageProps> {
  static propTypes = {
    message: PropTypes.object.isRequired,
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { message, highlightMenuProps, ...other } = this.props;
    return (
      <InView
        className={classNames('ui item status', message.severity, message.type)}
        {...other}
      >
        <Icon icon={getSeverityIcon(message.severity)} />
        {message.time > 0 && <TimeStamp time={message.time} />}
        <MessageText
          label={message.label}
          message={message}
          emojify={false}
          highlightMenuProps={highlightMenuProps}
        />
      </InView>
    );
  }
}

export { StatusMessage };
