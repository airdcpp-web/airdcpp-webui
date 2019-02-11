'use strict';
//@ts-ignore
import Reflux from 'reflux';

import SocketService from 'services/SocketService';
import QueueActions from 'actions/QueueActions';
import QueueFileActions from 'actions/QueueFileActions';

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


const TransferActionConfig: UI.ActionConfigList<API.Transfer> = [
  { 'force': { 
    asyncResult: true,
    displayName: 'Force connect',
    access: API.AccessEnum.TRANSFERS,
    icon: IconConstants.REFRESH,
    filter: isDownload,
  } },
  { 'disconnect': { 
    asyncResult: true,
    displayName: 'Disconnect',
    access: API.AccessEnum.TRANSFERS, 
    icon: IconConstants.DISCONNECT,
  } },
  'divider',
  { 'removeFile': { 
    asyncResult: true,
    displayName: 'Remove file from queue',
    access: API.AccessEnum.QUEUE_EDIT, 
    icon: IconConstants.REMOVE,
    filter: removeFile,
  } },
  { 'removeSource': { 
    asyncResult: true,
    displayName: 'Remove user from queue',
    access: API.AccessEnum.QUEUE_EDIT, 
    icon: IconConstants.REMOVE,
    filter: removeSource,
  } },
];

const TransferActions = Reflux.createActions(TransferActionConfig);


TransferActions.force.listen(function (this: UI.AsyncActionType<API.Transfer>, transfer: API.Transfer) {
  const that = this;
  return SocketService.post(`${TransferConstants.TRANSFERS_URL}/${transfer.id}/force`)
    .then(that.completed)
    .catch(that.failed);
});

TransferActions.disconnect.listen(function (this: UI.AsyncActionType<API.Transfer>, transfer: API.Transfer) {
  const that = this;
  return SocketService.post(`${TransferConstants.TRANSFERS_URL}/${transfer.id}/disconnect`)
    .then(that.completed)
    .catch(that.failed);
});

TransferActions.removeFile.listen(function (transfer: API.Transfer) {
  return QueueFileActions.actions.removeFile({
    id: transfer.queue_file_id,
    target: transfer.target,
    name: transfer.name,
  });
});

TransferActions.removeSource.listen(function (transfer: API.Transfer) {
  return QueueActions.actions.removeSource(transfer);
});

export default {
  moduleId: UI.Modules.TRANSFERS,
  actions: TransferActions,
};
