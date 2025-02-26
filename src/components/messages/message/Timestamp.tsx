import * as React from 'react';

import { useFormatter } from '@/context/FormatterContext';

interface TimeStampProps {
  time: number;
}

export const TimeStamp: React.FC<TimeStampProps> = ({ time }) => {
  const { formatTimestamp } = useFormatter();
  return <div className="time">{formatTimestamp(time)}</div>;
};
