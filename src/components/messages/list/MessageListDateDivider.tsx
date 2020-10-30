//import PropTypes from 'prop-types';
import * as React from 'react';

import { formatCalendarTime } from 'utils/ValueFormat';

import * as UI from 'types/ui';

import Icon from 'components/semantic/Icon';
import IconConstants from 'constants/IconConstants';
import { useTranslation } from 'react-i18next';


const getMessageDay = (listItem: UI.MessageListItem) => {
  const message = !!listItem.chat_message ? listItem.chat_message : listItem.log_message;
  return message && new Date(message.time * 1000).getDate();
};

const isToday = (message: UI.MessageListItem) => {
  return getMessageDay(message) === new Date().getDate();
};

const isHistoryItem = (listItem: UI.MessageListItem) => {
  const message = !!listItem.chat_message ? listItem.chat_message : listItem.log_message;
  return message && message.time === 0; 
};

export const showDateDivider = (index: number, messageList: UI.MessageListItem[]) => {
  const currentMessage = messageList[index];

  // First message? History log won't count
  if (index === 0 || (index === 1 && isHistoryItem(messageList[index - 1]))) {
    // Don't show for message that were received today
    if (!isToday(currentMessage) && !isHistoryItem(currentMessage)) {
      return true;
    }

    return false;
  }

  return getMessageDay(messageList[index - 1]) !== getMessageDay(currentMessage);
};

interface MessageListDateDividerProps {
  time: number;
}

export const MessageListDateDivider: React.FC<MessageListDateDividerProps> = ({ time }) => {
  const { t } = useTranslation();
  return (
    <div 
      key={ `divider${time}` }
      className="ui horizontal date divider"
    >
      <Icon 
        icon={ IconConstants.DATE }
      />
      { formatCalendarTime(time, t) }
    </div>
  );
};
