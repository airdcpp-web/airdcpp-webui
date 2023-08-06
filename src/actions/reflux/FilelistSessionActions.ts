//@ts-ignore
import Reflux from 'reflux';

import FilelistConstants from 'constants/FilelistConstants';

import LoginStore from 'stores/LoginStore';
import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';

import SessionActionDecorator from './decorators/SessionActionDecorator';
import { getFilePath } from 'utils/FileUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { Location, NavigateFunction } from 'react-router-dom';
import { ErrorResponse } from 'airdcpp-apisocket';

import {
  changeFilelistHubUrl,
  changeFilelistShareProfile,
  changeFilelistDirectory,
} from 'services/api/FilelistApi';

const FilelistActionConfig: UI.RefluxActionConfigList<API.FilelistSession> = [
  { createSession: { asyncResult: true } },
  { ownList: { asyncResult: true } },
  { setRead: { asyncResult: true } },
];

const FilelistSessionActions = Reflux.createActions(FilelistActionConfig);

// SESSION CREATION
const openSession = (navigate: NavigateFunction, session: API.FilelistSession) => {
  navigate(`/filelists/session/${session.id}`, {
    state: {
      pending: true,
    },
  });
};

interface CreateSessionProps {
  sessionStore: UI.SessionStore<API.FilelistSession>;
  location: Location;
  navigate: NavigateFunction;
}

interface CreateSessionData {
  user: API.HintedUser;
  path?: string;
}

FilelistSessionActions.createSession.listen(function (
  this: UI.AsyncActionType<API.FilelistSession>,
  { user, path = '/' }: CreateSessionData,
  props: CreateSessionProps,
) {
  const { sessionStore } = props;
  const directory = getFilePath(path);
  const session = sessionStore.getSession(user.cid);
  if (session) {
    if (session.user.hub_url !== user.hub_url) {
      changeFilelistHubUrl(session, user.hub_url);
    }

    if (directory !== '/' && (!session.location || session.location.path !== directory)) {
      changeFilelistDirectory(session, directory);
    }

    this.completed(session, props);
    return;
  }

  const that = this;
  SocketService.post<API.FilelistSession>(FilelistConstants.SESSIONS_URL, {
    user: {
      cid: user.cid,
      hub_url: user.hub_url,
    },
    directory: directory,
  })
    .then((data) => that.completed(data, props))
    .catch(that.failed);
});

FilelistSessionActions.createSession.completed.listen(function (
  session: API.FilelistSession,
  { navigate }: CreateSessionProps,
) {
  openSession(navigate, session);
});

FilelistSessionActions.createSession.failed.listen(function (error: ErrorResponse) {
  NotificationActions.apiError('Failed to create filelist session', error);
});

FilelistSessionActions.ownList.listen(function (
  this: UI.AsyncActionType<API.FilelistSession>,
  shareProfileId: number,
  props: CreateSessionProps,
) {
  const { sessionStore } = props;
  const session = sessionStore.getSession(LoginStore.systemInfo.cid);
  if (session) {
    if (session.share_profile!.id !== shareProfileId) {
      changeFilelistShareProfile(session, shareProfileId);
    }

    this.completed(session, props);
    return;
  }

  const that = this;
  SocketService.post<API.FilelistSession>(`${FilelistConstants.SESSIONS_URL}/self`, {
    share_profile: shareProfileId,
  })
    .then((data) => that.completed(data, props))
    .catch(that.failed);
});

FilelistSessionActions.ownList.completed.listen(function (
  session: API.FilelistSession,
  { navigate }: CreateSessionProps,
) {
  openSession(navigate, session);
});

// SESSION UPDATES

FilelistSessionActions.setRead.listen(function (
  this: UI.AsyncActionType<API.FilelistSession>,
  session: API.FilelistSession,
) {
  const that = this;
  SocketService.post(`${FilelistConstants.SESSIONS_URL}/${session.id}/read`)
    .then(that.completed)
    .catch(that.failed);
});

const FilelistSessionActionsDecorated = SessionActionDecorator(
  FilelistSessionActions,
  FilelistConstants.SESSIONS_URL,
);

export default FilelistSessionActionsDecorated as UI.RefluxActionListType<void>;
