'use strict';
//@ts-ignore
import Reflux from 'reflux';

import SocketService from 'services/SocketService';
import ConfirmDialog from 'components/semantic/ConfirmDialog';
import History from 'utils/History';

import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { Location } from 'history';


const noData = (item: any) => !item;

const FavoriteDirectoryActions = Reflux.createActions([
  { 'create': { 
    displayName: 'Add directory',
    access: API.AccessEnum.SETTINGS_EDIT, 
    icon: IconConstants.CREATE,
    filter: noData,
  } },
  { 'edit': { 
    displayName: 'Edit directory',
    access: API.AccessEnum.SETTINGS_EDIT, 
    icon: IconConstants.EDIT,
  } },
  { 'remove': { 
    asyncResult: true, 
    children: [ 'confirmed' ], 
    displayName: 'Remove directory',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.REMOVE,
  } },
] as UI.ActionConfigList<API.FavoriteDirectoryEntry>);

FavoriteDirectoryActions.create.listen(function (location: Location) {
  History.push(`${location.pathname}/directories`);
});

FavoriteDirectoryActions.edit.listen(function (directory: API.FavoriteDirectoryEntry, location: Location) {
  History.push(`${location.pathname}/directories/${directory.id}`);
});

FavoriteDirectoryActions.remove.listen(function (
  this: UI.ConfirmActionType<API.FavoriteDirectoryEntry>, 
  directory: API.FavoriteDirectoryEntry
) {
  const options = {
    title: this.displayName,
    content: `Are you sure that you want to remove the favorite directory ${directory.name}?`,
    icon: this.icon,
    approveCaption: 'Remove directory',
    rejectCaption: `Don't remove`,
  };

  ConfirmDialog(options, this.confirmed.bind(this, directory));
});

FavoriteDirectoryActions.remove.confirmed.listen(function (
  this: UI.ConfirmActionType<API.FavoriteDirectoryEntry>, 
  directory: API.FavoriteDirectoryEntry
) {
  const that = this;
  return SocketService.delete(`${FavoriteDirectoryConstants.DIRECTORIES_URL}/${directory.id}`)
    .then(FavoriteDirectoryActions.remove.completed.bind(that, directory))
    .catch(FavoriteDirectoryActions.remove.failed.bind(that, directory));
});

export default FavoriteDirectoryActions;
