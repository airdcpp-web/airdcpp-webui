'use strict';
//@ts-ignore
import Reflux from 'reflux';
import { Location } from 'history';

import SocketService from 'services/SocketService';

import WebUserConstants from 'constants/WebUserConstants';

import History from 'utils/History';
import IconConstants from 'constants/IconConstants';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';
import * as UI from 'types/ui';


const isOther = (user: API.WebUser) => user.id !== LoginStore.user.id;
const noData = (data: any) => !data;


const WebUserActionConfig: UI.ActionConfigList<API.WebUser> = [
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
    displayName: 'Remove user', 
    filter: isOther,
    icon: IconConstants.REMOVE,
    confirmation: {
      content: 'Are you sure that you want to remove the user {{item.username}}?',
      approveCaption: 'Remove user',
      rejectCaption: `Don't remove`,
    }
  } },
];

const WebUserActions = Reflux.createActions(WebUserActionConfig);

WebUserActions.create.listen(function (itemData: any, location: Location) {
  History.push(`${location.pathname}/users`);
});

WebUserActions.edit.listen(function (user: API.WebUser, location: Location) {
  History.push(`${location.pathname}/users/${user.id}`);
});

WebUserActions.remove.listen(function (this: UI.AsyncActionType<API.WebUser>, user: API.WebUser) {
  const that = this;
  return SocketService.delete(`${WebUserConstants.USERS_URL}/${user.id}`)
    .then(WebUserActions.remove.completed.bind(that, user))
    .catch(WebUserActions.remove.failed.bind(that, user));
});

export default {
  moduleId: UI.Modules.SETTINGS,
  actions: WebUserActions,
};
