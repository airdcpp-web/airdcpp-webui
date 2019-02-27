'use strict';

import SocketService from 'services/SocketService';
import QueueActions from 'actions/reflux/QueueActions';

import QueueFileActions from 'actions/reflux/QueueFileActions';

import { default as TransferConstants, StatusEnum } from 'constants/TransferConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';


const isFilelist = (transfer: API.Transfer) => transfer.type && 
  (transfer.type as API.FileType).content_type === 'filelist';
const isDownload = (transfer: API.Transfer) => transfer.download;
const isFinished = (transfer: API.Transfer) => transfer.status.id === StatusEnum.FINISHED;
const removeFile = (transfer: API.Transfer) => isDownload(transfer) && isFilelist(transfer) && !isFinished(transfer);
const removeSource = (transfer: API.Transfer) => isDownload(transfer) && !isFinished(transfer);


const handleForce: UI.ActionHandler<API.Transfer> = ({ data: transfer }) => {
  return SocketService.post(`${TransferConstants.TRANSFERS_URL}/${transfer.id}/force`);
};

const handleDisconnect: UI.ActionHandler<API.Transfer> = ({ data: transfer }) => {
  return SocketService.post(`${TransferConstants.TRANSFERS_URL}/${transfer.id}/disconnect`);
};

const handleRemoveFile: UI.ActionHandler<API.Transfer> = ({ data: transfer }) => {
  return QueueFileActions.removeFile({
    id: transfer.queue_file_id,
    target: transfer.target,
    name: transfer.name,
  });
};

const handleRemoveSource: UI.ActionHandler<API.Transfer> = ({ data: transfer }) => {
  return QueueActions.removeSource(transfer);
};



const TransferActions: UI.ActionListType<API.Transfer> = {
  force: {
    displayName: 'Force connect',
    access: API.AccessEnum.TRANSFERS,
    icon: IconConstants.REFRESH,
    filter: isDownload,
    handler: handleForce,
  },
  disconnect: {
    displayName: 'Disconnect',
    access: API.AccessEnum.TRANSFERS, 
    icon: IconConstants.DISCONNECT,
    handler: handleDisconnect,
  },
  divider: null,
  removeFile: { 
    displayName: 'Remove file from queue',
    access: API.AccessEnum.QUEUE_EDIT, 
    icon: IconConstants.REMOVE,
    filter: removeFile,
    handler: handleRemoveFile,
  },
  removeSource: {
    displayName: 'Remove user from queue',
    access: API.AccessEnum.QUEUE_EDIT, 
    icon: IconConstants.REMOVE,
    filter: removeSource,
    handler: handleRemoveSource,
  },
};

export default {
  moduleId: UI.Modules.TRANSFERS,
  actions: TransferActions,
};
