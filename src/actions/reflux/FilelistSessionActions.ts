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

import { changeFilelistHubUrl, changeFilelistShareProfile, changeFilelistDirectory } from 'services/api/FilelistApi';


const FilelistSessionActions = Reflux.createActions([
  { 'createSession': { asyncResult: true } },
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
      changeFilelistHubUrl(session, user.hub_url);
    }

    if (directory !== '/' && session.location.path !== directory) {
      changeFilelistDirectory(session, directory);
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
      changeFilelistShareProfile(session, shareProfileId);
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
