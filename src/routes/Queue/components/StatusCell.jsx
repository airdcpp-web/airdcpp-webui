import React from 'react';
import classNames from 'classnames';

import { StatusEnum } from 'constants/QueueConstants';
import Progress from 'components/semantic/Progress';


const getStatusClass = (cellData, rowData) => {
  if (cellData.completed) {
    return 'success';
  }

  const statusId = cellData.id;
  return classNames(
    { 'grey': (!statusId || statusId === StatusEnum.QUEUED) && rowData.speed === 0 },
    { 'blue': (!statusId || statusId === StatusEnum.QUEUED) && rowData.speed > 0 },
  );
};

const StatusCell = ({ cellData, rowDataGetter, ...props }) => {
  if (cellData.failed) {
    // There isn't much space for other information
    return (
      <span className="error">
        { cellData.str }
      </span>
    );
  }

  const rowData = rowDataGetter();
  return (
    <Progress 
      className={ getStatusClass(cellData, rowData) }
      caption={ cellData.str }
      percent={ (rowData.downloaded_bytes*100) / rowData.size }
    />
  );
};

export default StatusCell;