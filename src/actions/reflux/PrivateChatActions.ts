//@ts-ignore
import Reflux from 'reflux';
import PrivateChatConstants from 'constants/PrivateChatConstants';
import SocketService from 'services/SocketService';

import History from 'utils/History';

import NotificationActions from 'actions/NotificationActions';

import ChatActionDecorator from './decorators/ChatActionDecorator';
import SessionActionDecorator from './decorators/SessionActionDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { Location } from 'history';
import { ErrorResponse } from 'airdcpp-apisocket';
import { changePrivateChatHubUrl } from 'services/api/PrivateChatApi';


const PrivateChatActionConfig: UI.RefluxActionConfigList<API.PrivateChat> = [
  { 'createSession': { asyncResult: true } },
];

const PrivateChatActions = Reflux.createActions(PrivateChatActionConfig);

// SESSION CREATION
PrivateChatActions.createSession.listen(function (
  this: UI.AsyncActionType<API.PrivateChat>, 
  location: Location, 
  user: API.HintedUser, 
  sessionStore: any
) {
  const session = sessionStore.getSession(user.cid);
  if (session) {
    if (session.user.hub_url !== user.hub_url) {
      // TODO: error handling
      changePrivateChatHubUrl(session, user.hub_url);
    }

    this.completed(location, user, session);
    return;
  }

  const that = this;
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


const PrivateChatActionsDecorated = SessionActionDecorator(
  ChatActionDecorator(
    PrivateChatActions, 
    PrivateChatConstants.SESSIONS_URL
  ), 
  PrivateChatConstants.SESSIONS_URL
);

export default PrivateChatActionsDecorated as UI.RefluxActionListType<void>;
