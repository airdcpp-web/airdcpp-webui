import React from 'react';
import classNames from 'classnames';

import Progress from 'components/semantic/Progress';

import EncryptionState from 'components/EncryptionState';
import Loader from 'components/semantic/Loader';
import { RowWrapperCellChildProps } from 'components/table/RowWrapperCell';

import * as API from 'types/api';


const getStatusClass = (cellData: API.TransferStatus, rowData: API.Transfer) => {
  const statusId = cellData.id;
  return classNames(
    { 'grey': statusId === API.TransferStatusEnum.WAITING },
    { 'blue': statusId === API.TransferStatusEnum.RUNNING && rowData.download },
    { 'red': statusId === API.TransferStatusEnum.RUNNING && !rowData.download },
    { 'green': statusId === API.TransferStatusEnum.FINISHED && rowData.download },
    { 'brown': statusId === API.TransferStatusEnum.FINISHED && !rowData.download },
    { 'red':  statusId === API.TransferStatusEnum.FAILED },
  );
};

interface StatusCellProps extends RowWrapperCellChildProps<API.TransferStatus, API.Transfer> {

}

const StatusCell: React.SFC<StatusCellProps> = ({ cellData, rowDataGetter }) => {
  if (cellData!.id === API.TransferStatusEnum.WAITING) {
    return <Loader size="small" inline={ true } text={ cellData!.str }/>;
  }

  if (cellData!.id === API.TransferStatusEnum.FAILED) {
    return <span className="error">{ cellData!.str }</span>;
  }

  const rowData = rowDataGetter!();
  let caption: React.ReactNode = cellData!.str;
  if (rowData.encryption) {
    caption = (
      <span className="transfer status encryption">
        <EncryptionState encryption={ rowData.encryption }/>
        { caption }
      </span>
    );
  }

  return (
    <Progress 
      className={ getStatusClass(cellData!, rowData) }
      caption={ caption }
      percent={ (rowData.bytes_transferred * 100) / rowData.size }
    />
  );
};

export default StatusCell;