'use strict';
//@ts-ignore
import Reflux from 'reflux';

import SocketService from 'services/SocketService';
import History from 'utils/History';

import ShareRootConstants from 'constants/ShareRootConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { Location } from 'history';


const noData = (item: any) => !item;


const ShareRootActionConfig: UI.ActionConfigList<API.ShareRootEntry> = [
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
    displayName: 'Remove directory',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.REMOVE,
    confirmation: root => ({
      // tslint:disable-next-line:max-line-length
      content: `Are you sure that you want to remove the directory ${root.virtual_name} from share? It will be removed from all share profiles.`,
      approveCaption: 'Remove directory',
      rejectCaption: `Don't remove`,
    })
  } },
];

const ShareRootActions = Reflux.createActions(ShareRootActionConfig);


ShareRootActions.create.listen(function (data: API.ShareRootEntry, location: Location) {
  History.push(`${location.pathname}/directories`);
});

ShareRootActions.edit.listen(function (root: API.ShareRootEntry, location: Location) {
  History.push(`${location.pathname}/directories/${root.id}`);
});

ShareRootActions.remove.listen(function (
  this: UI.AsyncActionType<API.ShareRootEntry>, 
  root: API.ShareRootEntry
) {
  const that = this;
  return SocketService.delete(ShareRootConstants.ROOTS_URL + '/' + root.id)
    .then(ShareRootActions.remove.completed.bind(that, root))
    .catch(ShareRootActions.remove.failed.bind(that, root));
});

export default ShareRootActions;
