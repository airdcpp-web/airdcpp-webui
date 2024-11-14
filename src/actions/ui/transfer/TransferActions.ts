import SocketService from 'services/SocketService';

import { QueueSourceRemoveAction } from 'actions/ui/queue/QueueSourceActions';

import { QueueFileRemoveAction } from 'actions/ui/queue/QueueFileActions';

import { default as TransferConstants, StatusEnum } from 'constants/TransferConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { MENU_DIVIDER } from 'constants/ActionConstants';

// Filters
type Filter = UI.ActionFilter<API.Transfer>;
const isFilelist: Filter = ({ itemData: transfer }) =>
  !!transfer.type && (transfer.type as API.FileType).content_type === 'filelist';
const isDownload: Filter = ({ itemData: transfer }) => transfer.download;
const isFinished: Filter = ({ itemData: transfer }) =>
  transfer.status.id === StatusEnum.FINISHED;
const removeFile: Filter = (data) =>
  isDownload(data) && isFilelist(data) && !isFinished(data);
const removeSource: Filter = (data) => isDownload(data) && !isFinished(data);

// Handlers
type Handler = UI.ActionHandler<API.Transfer>;
const handleForce: Handler = ({ itemData: transfer }) => {
  return SocketService.post(`${TransferConstants.TRANSFERS_URL}/${transfer.id}/force`);
};

const handleDisconnect: Handler = ({ itemData: transfer }) => {
  return SocketService.post(
    `${TransferConstants.TRANSFERS_URL}/${transfer.id}/disconnect`,
  );
};

const handleRemoveFile: Handler = ({ itemData: transfer, ...other }) => {
  return QueueFileRemoveAction.handler({
    itemData: {
      id: transfer.queue_file_id,
      target: transfer.target,
      name: transfer.name,
    } as API.QueueFile,
    ...other,
  });
};

const handleRemoveSource: Handler = ({ itemData: transfer, ...other }) => {
  return QueueSourceRemoveAction.handler({
    itemData: {
      ...transfer.user,
      id: transfer.user.cid,
      hub_urls: [transfer.user.hub_url],
      flags: transfer.user.flags as API.UserFlag[],
    },
    ...other,
  });
};

export const TransferForceAction = {
  id: 'force',
  displayName: 'Force connect',
  access: API.AccessEnum.TRANSFERS,
  icon: IconConstants.REFRESH_COLORED,
  filter: isDownload,
  handler: handleForce,
};

export const TransferDisconnectAction = {
  id: 'disconnect',
  displayName: 'Disconnect',
  access: API.AccessEnum.TRANSFERS,
  icon: IconConstants.DISCONNECT,
  handler: handleDisconnect,
};

export const TransferRemoveFileAction = {
  id: 'removeFile',
  displayName: 'Remove file from queue',
  access: API.AccessEnum.QUEUE_EDIT,
  icon: IconConstants.REMOVE,
  filter: removeFile,
  handler: handleRemoveFile,
  notifications: {
    onSuccess: 'File {{item.name}} was removed from queue',
  },
};

export const TransferRemoveSourceAction = {
  id: 'removeSource',
  displayName: 'Remove user from queue',
  access: API.AccessEnum.QUEUE_EDIT,
  icon: IconConstants.REMOVE,
  filter: removeSource,
  handler: handleRemoveSource,
  notifications: {
    onSuccess: 'The user {{item.user.nicks}} was removed from {{result.count}} files',
  },
};

const TransferItemActions: UI.ActionListType<API.Transfer> = {
  force: TransferForceAction,
  disconnect: TransferDisconnectAction,
  divider: MENU_DIVIDER,
  removeFile: TransferRemoveFileAction,
  removeSource: TransferRemoveSourceAction,
};

export const TransferActionModule = {
  moduleId: UI.Modules.TRANSFERS,
};

export const TransferItemActionMenu = {
  moduleData: TransferActionModule,
  actions: TransferItemActions,
};

const TransferActions: UI.ActionListType<undefined> = {};

export const TransferActionMenu = {
  moduleData: TransferActionModule,
  actions: TransferActions,
};
