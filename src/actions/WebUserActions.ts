'use strict';
//@ts-ignore
import Reflux from 'reflux';
import { Location } from 'history';

import SocketService from 'services/SocketService';

import ConfirmDialog from 'components/semantic/ConfirmDialog';

import WebUserConstants from 'constants/WebUserConstants';

import History from 'utils/History';
import IconConstants from 'constants/IconConstants';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';
import * as UI from 'types/ui';


const isOther = (user: API.WebUser) => user.id !== LoginStore.user.id;
const noData = (data: any) => !data;


const WebUserActions = Reflux.createActions([
  { 'create': { 
    displayName: 'Add user',
    icon: IconConstants.CREATE,
    filter: noData,
  } },
  { 'edit': { 
    displayName: 'Edit user',
    icon: IconConstants.EDIT,
  } },
  { 'remove': { 
    asyncResult: true, 
    children: [ 'confirmed' ], 
    displayName: 'Remove user', 
    filter: isOther,
    icon: IconConstants.REMOVE,
  } },
] as UI.ActionConfigList<API.WebUser>);

WebUserActions.create.listen(function (location: Location) {
  History.push(`${location.pathname}/users`);
});

WebUserActions.edit.listen(function (user: API.WebUser, location: Location) {
  History.push(`${location.pathname}/users/${user.id}`);
});

WebUserActions.remove.listen(function (this: UI.ConfirmActionType<API.WebUser>, user: API.WebUser) {
  const options = {
    title: this.displayName,
    content: `Are you sure that you want to remove the user ${user.username}?`,
    icon: this.icon,
    approveCaption: 'Remove user',
    rejectCaption: `Don't remove`,
  };

  ConfirmDialog(options, this.confirmed.bind(this, user));
});

WebUserActions.remove.confirmed.listen(function (this: UI.AsyncActionType<API.WebUser>, user: API.WebUser) {
  const that = this;
  return SocketService.delete(`${WebUserConstants.USERS_URL}/${user.id}`)
    .then(WebUserActions.remove.completed.bind(that, user))
    .catch(WebUserActions.remove.failed.bind(that, user));
});

export default WebUserActions;
