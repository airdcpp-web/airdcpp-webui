'use strict';

import SocketService from 'services/SocketService';

import QueueSourceActions from 'actions/ui/QueueSourceActions';

import QueueFileActions from 'actions/ui/QueueFileActions';

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

const handleRemoveFile: UI.ActionHandler<API.Transfer> = ({ data: transfer, ...other }) => {
  return QueueFileActions.actions.removeFile!.handler({
    data: {
      id: transfer.queue_file_id,
      target: transfer.target,
      name: transfer.name
    } as API.QueueFile,
    ...other
  });
};

const handleRemoveSource: UI.ActionHandler<API.Transfer> = ({ data: transfer, ...other }) => {
  return QueueSourceActions.actions.removeSource!.handler({
    data: {
      ...transfer.user,
      id: transfer.user.cid,
      hub_urls: [ transfer.user.hub_url ],
      flags: transfer.user.flags as API.UserFlag[]
    },
    ...other
  });
};



const TransferActions: UI.ActionListType<API.Transfer> = {
  force: {
    displayName: 'Force connect',
    access: API.AccessEnum.TRANSFERS,
    icon: IconConstants.REFRESH_COLORED,
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
    notifications: {
      onSuccess: 'File {{item.name}} was removed from queue',
    }
  },
  removeSource: {
    displayName: 'Remove user from queue',
    access: API.AccessEnum.QUEUE_EDIT, 
    icon: IconConstants.REMOVE,
    filter: removeSource,
    handler: handleRemoveSource,
    notifications: {
      onSuccess: 'The user {{item.user.nicks}} was removed from {{result.count}} files',
    }
  },
};

export default {
  moduleId: UI.Modules.TRANSFERS,
  actions: TransferActions,
};
