import React from 'react';

import { formatTimestamp } from 'utils/ValueFormat';


interface TimeStampProps {
  time: number;
}

export const TimeStamp: React.FC<TimeStampProps> = ({ time }) => (
  <div className="time">
    { formatTimestamp(time) }
  </div>
);
