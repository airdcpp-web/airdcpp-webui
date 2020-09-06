import React from 'react';

import { formatTimestamp } from 'utils/ValueFormat';

import * as API from 'types/api';


interface TimeStampProps {
  message: API.Message;
}

export const TimeStamp: React.FC<TimeStampProps> = ({ message }) => (
  <div className="time">
    { formatTimestamp(message.time) }
  </div>
);
