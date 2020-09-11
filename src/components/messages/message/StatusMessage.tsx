'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import { InView } from 'react-intersection-observer';

import Icon from 'components/semantic/Icon';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import { CommonMessageProps } from '../types';
import { MessageText } from './MessageText';
import { TimeStamp } from './Timestamp';


const getSeverityIcon = (severity: API.SeverityEnum) => {
  switch (severity) {
    case API.SeverityEnum.INFO: return IconConstants.INFO + ' circle';
    case API.SeverityEnum.WARNING: return IconConstants.WARNING;
    case API.SeverityEnum.ERROR: return IconConstants.ERROR;
    default: return '';
  }
};

interface StatusMessageProps extends CommonMessageProps {
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
    const { message, addDownload, highlightRemoteMenuId, entityId, ...other } = this.props;
    return (
      <InView
        className={ 'ui item status ' + message.severity }
        {...other}
      >
        <Icon icon={ getSeverityIcon(message.severity) }/>
        { message.time > 0 && <TimeStamp message={ message }/> }
        <MessageText
          message={ message }
          emojify={ false }
          addDownload={ addDownload }
          highlightRemoteMenuId={ highlightRemoteMenuId }
          entityId={ entityId }
        />
      </InView>
    );
  }
}

export { StatusMessage };
