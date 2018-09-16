import React from 'react';
import classNames from 'classnames';

import { StatusEnum } from 'constants/QueueConstants';
import Progress from 'components/semantic/Progress';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';


const getStatusClass = (cellData: API.QueueBundleStatus, rowData: API.QueueBundle) => {
  if (cellData.completed) {
    return 'success';
  }

  const statusId = cellData.id;
  return classNames(
    { 'grey': (!statusId || statusId === StatusEnum.QUEUED) && rowData.speed === 0 },
    { 'blue': (!statusId || statusId === StatusEnum.QUEUED) && rowData.speed > 0 },
  );
};

const StatusCell: React.SFC<RowWrapperCellChildProps<API.QueueBundleStatus, API.QueueBundle>> = (
  { cellData, rowDataGetter }
) => {
  if (cellData!.failed) {
    // There isn't much space for other information
    return (
      <span className="error">
        { cellData!.str }
      </span>
    );
  }

  const rowData = rowDataGetter!();
  return (
    <Progress 
      className={ getStatusClass(cellData!, rowData) }
      caption={ cellData!.str }
      percent={ (rowData.downloaded_bytes * 100) / rowData.size }
    />
  );
};

export default StatusCell;