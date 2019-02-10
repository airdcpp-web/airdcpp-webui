'use strict';
//@ts-ignore
import Reflux from 'reflux';
import PrivateChatConstants from 'constants/PrivateChatConstants';
import SocketService from 'services/SocketService';

import History from 'utils/History';

import NotificationActions from 'actions/NotificationActions';
import IconConstants from 'constants/IconConstants';

import ChatActionDecorator from './decorators/ChatActionDecorator';
import SessionActionDecorator from './decorators/SessionActionDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { Location } from 'history';
import { ErrorResponse } from 'airdcpp-apisocket';


const PrivateChatActionConfig: UI.ActionConfigList<API.PrivateChat> = [
  { 'createSession': { asyncResult: true } },
  { 'changeHubUrl': { asyncResult: true } },
  { 'connectCCPM': { 
    asyncResult: true,
    displayName: 'Connect',
    access: API.AccessEnum.PRIVATE_CHAT_EDIT, 
    icon: IconConstants.PLAY,
  } },
  { 'disconnectCCPM': { 
    asyncResult: true,
    access: API.AccessEnum.PRIVATE_CHAT_EDIT, 
    displayName: 'Disconnect', 
    icon: IconConstants.REMOVE,
  } },
];

const PrivateChatActions = Reflux.createActions(PrivateChatActionConfig);

// SESSION CREATION
PrivateChatActions.createSession.listen(function (
  this: UI.AsyncActionType<API.PrivateChat>, 
  location: Location, 
  user: API.HintedUser, 
  sessionStore: any
) {
  let session = sessionStore.getSession(user.cid);
  if (session) {
    if (session.user.hub_url !== user.hub_url) {
      PrivateChatActions.changeHubUrl(session, user.hub_url);
    }

    this.completed(location, user, session);
    return;
  }

  let that = this;
  SocketService.post(PrivateChatConstants.SESSIONS_URL, {
    user: {
      cid: user.cid,
      hub_url: user.hub_url,
    }
  })
    .then(that.completed.bind(that, location, user))
    .catch(that.failed);
});

PrivateChatActions.createSession.completed.listen(function (
  location: Location, 
  user: API.HintedUser, 
  //session: API.PrivateChat
) {
  History.push({
    pathname: `/messages/session/${user.cid}`, 
    state: {
      pending: true
    },
  });
});

PrivateChatActions.createSession.failed.listen(function (error: ErrorResponse) {
  NotificationActions.apiError('Failed to create chat session', error);
});


// SESSION UPDATES
PrivateChatActions.changeHubUrl.listen(function (
  this: UI.AsyncActionType<API.PrivateChat>, 
  session: API.PrivateChat, 
  hubUrl: string
) {
  let that = this;
  SocketService.patch(PrivateChatConstants.SESSIONS_URL + '/' + session.id, { hub_url: hubUrl })
    .then(data => that.completed(session, data))
    .catch(error => that.failed(error));
});

PrivateChatActions.connectCCPM.listen(function (
  this: UI.AsyncActionType<API.PrivateChat>, 
  session: API.PrivateChat
) {
  let that = this;
  SocketService.post(`${PrivateChatConstants.SESSIONS_URL}/${session.id}/ccpm`)
    .then(that.completed)
    .catch(that.failed);
});

PrivateChatActions.disconnectCCPM.listen(function (
  this: UI.AsyncActionType<API.PrivateChat>, 
  session: API.PrivateChat
) {
  let that = this;
  SocketService.delete(`${PrivateChatConstants.SESSIONS_URL}/${session.id}/ccpm`)
    .then(that.completed)
    .catch(that.failed);
});


const PrivateChatActionsDecorated = SessionActionDecorator(
  ChatActionDecorator(
    PrivateChatActions, PrivateChatConstants.SESSIONS_URL, API.AccessEnum.PRIVATE_CHAT_EDIT
  ), 
  PrivateChatConstants.SESSIONS_URL, 
  API.AccessEnum.PRIVATE_CHAT_EDIT
);

export default {
  id: UI.Modules.MESSAGES,
  actions: PrivateChatActionsDecorated,
};
