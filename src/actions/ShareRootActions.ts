'use strict';
//@ts-ignore
import Reflux from 'reflux';

import SocketService from 'services/SocketService';
import ConfirmDialog from 'components/semantic/ConfirmDialog';
import History from 'utils/History';

import ShareRootConstants from 'constants/ShareRootConstants';
import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { Location } from 'history';


const noData = (item: any) => !item;

const ShareRootActions = Reflux.createActions([
  { 'create': { 
    displayName: 'Add directory',
    access: AccessConstants.SETTINGS_EDIT, 
    icon: IconConstants.CREATE,
    filter: noData,
  } },
  { 'edit': { 
    displayName: 'Edit directory',
    access: AccessConstants.SETTINGS_EDIT, 
    icon: IconConstants.EDIT,
  } },
  { 'remove': { 
    asyncResult: true, 
    children: [ 'confirmed' ], 
    displayName: 'Remove directory',
    access: AccessConstants.SETTINGS_EDIT,
    icon: IconConstants.REMOVE,
  } },
]);

ShareRootActions.create.listen(function (data: API.ShareRootEntry, location: Location) {
  History.push(`${location.pathname}/directories`);
});

ShareRootActions.edit.listen(function (root: API.ShareRootEntry, location: Location) {
  History.push(`${location.pathname}/directories/${root.id}`);
});

ShareRootActions.remove.listen(function (this: UI.ConfirmActionType<API.ShareRootEntry>, root: API.ShareRootEntry) {
  const options = {
    title: this.displayName,
    // tslint:disable-next-line:max-line-length
    content: `Are you sure that you want to remove the directory ${root.virtual_name} from share? It will be removed from all share profiles.`,
    icon: this.icon,
    approveCaption: 'Remove directory',
    rejectCaption: `Don't remove`,
  };

  ConfirmDialog(options, this.confirmed.bind(this, root));
});

ShareRootActions.remove.confirmed.listen(function (
  this: UI.AsyncActionType<API.ShareRootEntry>, 
  root: API.ShareRootEntry
) {
  const that = this;
  return SocketService.delete(ShareRootConstants.ROOTS_URL + '/' + root.id)
    .then(ShareRootActions.remove.completed.bind(that, root))
    .catch(ShareRootActions.remove.failed.bind(that, root));
});

export default ShareRootActions;
