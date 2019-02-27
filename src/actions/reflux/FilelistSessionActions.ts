'use strict';
//@ts-ignore
import Reflux from 'reflux';

import FilelistConstants from 'constants/FilelistConstants';

import LoginStore from 'stores/LoginStore';
import SocketService from 'services/SocketService';

import History from 'utils/History';
import NotificationActions from 'actions/NotificationActions';

import SessionActionDecorator from './decorators/SessionActionDecorator';
import { getFilePath } from 'utils/FileUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { Location } from 'history';
import { ErrorResponse } from 'airdcpp-apisocket';


const FilelistSessionActions = Reflux.createActions([
  { 'createSession': { asyncResult: true } },
  { 'changeDirectory': { asyncResult: true } },
  { 'changeHubUrl': { asyncResult: true } },
  { 'changeShareProfile': { asyncResult: true } },
  { 'ownList': { asyncResult: true } },
  { 'setRead': { asyncResult: true } },
] as UI.RefluxActionConfigList<API.FilelistSession>);


// SESSION CREATION
const openSession = (location: Location, cid: string) => {
  History.push({
    pathname: `/filelists/session/${cid}`, 
    state: {
      pending: true
    },
  });
};

FilelistSessionActions.createSession.listen(function (
  this: UI.AsyncActionType<API.FilelistSession>, 
  location: Location, 
  user: API.HintedUser, 
  sessionStore: any, 
  path = '/'
) {
  const directory = getFilePath(path);
  const session = sessionStore.getSession(user.cid);
  if (session) {
    if (session.user.hub_url !== user.hub_url) {
      FilelistSessionActions.changeHubUrl(session, user.hub_url);
    }

    if (directory !== '/' && session.location.path !== directory) {
      FilelistSessionActions.changeDirectory(session, directory);
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

FilelistSessionActions.createSession.completed.listen(function (
  location: Location, 
  user: API.HintedUser,
) {
  openSession(location, user.cid);
});

FilelistSessionActions.createSession.failed.listen(function (error: ErrorResponse) {
  NotificationActions.apiError('Failed to create filelist session', error);
});

FilelistSessionActions.ownList.listen(function (
  this: UI.AsyncActionType<API.FilelistSession>, 
  location: Location, 
  shareProfileId: number, 
  sessionStore: any
) {
  let session = sessionStore.getSession(LoginStore.systemInfo.cid);
  if (session) {
    if (session.share_profile.id !== shareProfileId) {
      FilelistSessionActions.changeShareProfile(session, shareProfileId);
    }

    this.completed(location, shareProfileId, session);
    return;
  }

  let that = this;
  SocketService.post(`${FilelistConstants.SESSIONS_URL}/self`, {
    share_profile: shareProfileId,
  })
    .then((data) => that.completed(location, shareProfileId, data))
    .catch(that.failed);
});

FilelistSessionActions.ownList.completed.listen(function (location: Location) {
  openSession(location, LoginStore.systemInfo.cid);
});


// SESSION UPDATES
FilelistSessionActions.changeHubUrl.listen(function (
  this: UI.AsyncActionType<API.FilelistSession>, 
  session: API.FilelistSession, 
  hubUrl: string
) {
  let that = this;
  SocketService.patch(`${FilelistConstants.SESSIONS_URL}/${session.id}`, { 
    hub_url: hubUrl 
  })
    .then(data => that.completed(session.id, data))
    .catch(error => that.failed(error, session));
});

FilelistSessionActions.changeShareProfile.listen(function (
  this: UI.AsyncActionType<API.FilelistSession>, 
  session: API.FilelistSession, 
  shareProfileId: number
) {
  let that = this;
  SocketService.patch(`${FilelistConstants.SESSIONS_URL}/${session.id}`, { 
    share_profile: shareProfileId 
  })
    .then(data => that.completed(session, data))
    .catch(error => that.failed(error, session));
});

FilelistSessionActions.changeDirectory.listen(function (
  this: UI.AsyncActionType<API.FilelistSession>, 
  session: API.FilelistSession, 
  path: string
) {
  let that = this;
  SocketService.post(`${FilelistConstants.SESSIONS_URL}/${session.id}/directory`, { 
    list_path: path 
  })
    .then(data => that.completed(session, data))
    .catch(error => that.failed(error, session));
});

FilelistSessionActions.setRead.listen(function (
  this: UI.AsyncActionType<API.FilelistSession>, 
  session: API.FilelistSession
) {
  let that = this;
  SocketService.post(`${FilelistConstants.SESSIONS_URL}/${session.id}/read`)
    .then(that.completed)
    .catch(that.failed);
});

const FilelistSessionActionsDecorated = SessionActionDecorator(
  FilelistSessionActions, 
  FilelistConstants.SESSIONS_URL
);

export default FilelistSessionActionsDecorated as UI.RefluxActionListType<void>;
