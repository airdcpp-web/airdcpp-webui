import * as React from 'react';

import * as API from 'types/api';
import * as UI from 'types/ui';

import Icon from 'components/semantic/Icon';
import IconConstants from 'constants/IconConstants';
import { useFormatter } from 'context/FormatterContext';

const getMessageDay = (listItem: UI.MessageListItem) => {
  const message = !!listItem.chat_message ? listItem.chat_message : listItem.log_message;
  return message && new Date(message.time * 1000).getDate();
};

const isToday = (message: UI.MessageListItem) => {
  return getMessageDay(message) === new Date().getDate();
};

const isHistoryItem = (listItem: UI.MessageListItem) => {
  if (listItem.log_message) {
    return listItem.log_message.type === API.StatusMessageTypeEnum.HISTORY;
  }

  return false;
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

export const MessageListDateDivider: React.FC<MessageListDateDividerProps> = ({
  time,
}) => {
  const { formatCalendarTime } = useFormatter();
  return (
    <div key={`divider${time}`} className="ui horizontal date divider">
      <Icon icon={IconConstants.DATE} />
      {formatCalendarTime(time)}
    </div>
  );
};
