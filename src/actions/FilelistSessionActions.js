'use strict';
import Reflux from 'reflux';

import FilelistConstants from 'constants/FilelistConstants';

import LoginStore from 'stores/LoginStore';
import SocketService from 'services/SocketService';

import History from 'utils/History';
import NotificationActions from 'actions/NotificationActions';

import SessionActionDecorator from './decorators/SessionActionDecorator';
import AccessConstants from 'constants/AccessConstants';


const FilelistSessionActions = Reflux.createActions([
  { 'createSession': { asyncResult: true } },
  { 'changeDirectory': { asyncResult: true } },
  { 'changeHubUrl': { asyncResult: true } },
  { 'changeShareProfile': { asyncResult: true } },
  { 'ownList': { asyncResult: true } },
  { 'setRead': { asyncResult: true } },
]);

// SESSION CREATION
const openSession = (location, cid) => {
  History.push({
    pathname: `/filelists/session/${cid}`, 
    state: {
      pending: true
    },
  });
};

FilelistSessionActions.createSession.listen(function (location, user, sessionStore, directory = '/') {
  const session = sessionStore.getSession(user.cid);
  if (session) {
    if (session.user.hub_url !== user.hub_url) {
      FilelistSessionActions.changeHubUrl(session.id, user.hub_url);
    }

    if (directory !== '/' && session.location.path !== directory) {
      FilelistSessionActions.changeDirectory(user.cid, directory);
    }

    this.completed(location, user, session);
    return;
  }

  let that = this;
  SocketService.post(FilelistConstants.SESSIONS_URL, {
    user: {
      cid: user.cid,
      hub_url: user.hub_url,
    },
    directory: directory,
  })
    .then((data) => that.completed(location, user, data))
    .catch(that.failed);
});

FilelistSessionActions.createSession.completed.listen(function (location, user, session) {
  openSession(location, user.cid);
});

FilelistSessionActions.createSession.failed.listen(function (error) {
  NotificationActions.apiError('Failed to create filelist session', error);
});

FilelistSessionActions.ownList.listen(function (location, profile, sessionStore) {
  let session = sessionStore.getSession(LoginStore.systemInfo.cid);
  if (session) {
    if (session.share_profile.id !== profile) {
      FilelistSessionActions.changeShareProfile(session.id, profile);
    }

    this.completed(location, profile, session);
    return;
  }

  let that = this;
  SocketService.post(`${FilelistConstants.SESSIONS_URL}/self`, {
    share_profile: profile,
  })
    .then((data) => that.completed(location, profile, data))
    .catch(that.failed);
});

FilelistSessionActions.ownList.completed.listen(function (location, profile, session) {
  openSession(location, LoginStore.systemInfo.cid);
});


// SESSION UPDATES
FilelistSessionActions.changeHubUrl.listen(function (cid, hubUrl) {
  let that = this;
  SocketService.patch(`${FilelistConstants.SESSIONS_URL}/${cid}`, { 
    hub_url: hubUrl 
  })
    .then(data => that.completed(cid, data))
    .catch(error => that.failed(cid, error));
});

FilelistSessionActions.changeShareProfile.listen(function (cid, profile) {
  let that = this;
  SocketService.patch(`${FilelistConstants.SESSIONS_URL}/${cid}`, { 
    share_profile: profile 
  })
    .then(data => that.completed(cid, data))
    .catch(error => that.failed(cid, error));
});

FilelistSessionActions.changeDirectory.listen(function (cid, path) {
  let that = this;
  SocketService.post(`${FilelistConstants.SESSIONS_URL}/${cid}/directory`, { 
    list_path: path 
  })
    .then(data => that.completed(cid, data))
    .catch(error => that.failed(cid, error));
});

FilelistSessionActions.setRead.listen(function (cid) {
  let that = this;
  SocketService.post(`${FilelistConstants.SESSIONS_URL}/${cid}/read`)
    .then(that.completed)
    .catch(that.failed);
});

export default SessionActionDecorator(FilelistSessionActions, FilelistConstants.SESSIONS_URL, AccessConstants.FILELISTS_EDIT);
