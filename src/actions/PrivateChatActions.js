'use strict';
import Reflux from 'reflux';
import PrivateChatConstants from 'constants/PrivateChatConstants';
import SocketService from 'services/SocketService';

import History from 'utils/History';

import NotificationActions from 'actions/NotificationActions';
import AccessConstants from 'constants/AccessConstants';
import IconConstants from 'constants/IconConstants';

import ChatActionDecorator from './decorators/ChatActionDecorator';
import SessionActionDecorator from './decorators/SessionActionDecorator';


const PrivateChatActions = Reflux.createActions([
  { 'createSession': { asyncResult: true } },
  { 'changeHubUrl': { asyncResult: true } },
  { 'connectCCPM': { 
    asyncResult: true,
    displayName: 'Connect',
    access: AccessConstants.PRIVATE_CHAT_EDIT, 
    icon: IconConstants.PLAY,
  } },
  { 'disconnectCCPM': { 
    asyncResult: true,
    access: AccessConstants.PRIVATE_CHAT_EDIT, 
    displayName: 'Disconnect', 
    icon: IconConstants.REMOVE,
  } },
]);

// SESSION CREATION
PrivateChatActions.createSession.listen(function (location, user, sessionStore) {
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

PrivateChatActions.createSession.completed.listen(function (location, user, session) {
  History.push({
    pathname: `/messages/session/${user.cid}`, 
    state: {
      pending: true
    },
  });
});

PrivateChatActions.createSession.failed.listen(function (error) {
  NotificationActions.apiError('Failed to create chat session', error);
});


// SESSION UPDATES
PrivateChatActions.changeHubUrl.listen(function (session, hubUrl) {
  let that = this;
  SocketService.patch(PrivateChatConstants.SESSIONS_URL + '/' + session.id, { hub_url: hubUrl })
    .then(data => that.completed(session, data))
    .catch(error => that.failed(session, error));
});

PrivateChatActions.connectCCPM.listen(function (session) {
  let that = this;
  SocketService.post(PrivateChatConstants.SESSIONS_URL + '/' + session.id + '/ccpm')
    .then(that.completed)
    .catch(that.failed);
});

PrivateChatActions.disconnectCCPM.listen(function (session) {
  let that = this;
  SocketService.delete(PrivateChatConstants.SESSIONS_URL + '/' + session.id + '/ccpm')
    .then(that.completed)
    .catch(that.failed);
});


export default SessionActionDecorator(
  ChatActionDecorator(PrivateChatActions, PrivateChatConstants.SESSIONS_URL, AccessConstants.PRIVATE_CHAT_EDIT), PrivateChatConstants.SESSIONS_URL, AccessConstants.PRIVATE_CHAT_EDIT
);
