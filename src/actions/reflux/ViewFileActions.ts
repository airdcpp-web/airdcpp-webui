//@ts-ignore
import Reflux from 'reflux';
import ViewFileConstants from 'constants/ViewFileConstants';

import SocketService from 'services/SocketService';

import History from 'utils/History';
import NotificationActions from 'actions/NotificationActions';

import SessionActionDecorator from './decorators/SessionActionDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { Location } from 'history';
import { ErrorResponse } from 'airdcpp-apisocket';

const ViewFileActionConfig: UI.RefluxActionConfigList<void> = [
  { createSession: { asyncResult: true } },
  { openLocalFile: { asyncResult: true } },
  { setRead: { asyncResult: true } },
];

const ViewFileActions = Reflux.createActions(ViewFileActionConfig);

interface RemoteViewFileData {
  itemInfo: UI.DownloadableItemInfo;
  user: API.HintedUserBase;
}

// Remote file
ViewFileActions.createSession.listen(function (
  this: UI.AsyncActionType<API.ViewFile>,
  { itemInfo, user }: RemoteViewFileData,
  isText: boolean,
  location: Location,
  sessionStore: any
) {
  const session = sessionStore.getSession(itemInfo.tth);
  if (session) {
    this.completed(location, session);
    return;
  }

  const { tth, size, name } = itemInfo;
  const fileData = {
    user,
    tth,
    size,
    name,
    text: isText,
  };

  const that = this;
  SocketService.post(ViewFileConstants.SESSIONS_URL, fileData)
    .then((data: API.ViewFile) => that.completed(location, data))
    .catch(that.failed);
});

// Local file
ViewFileActions.openLocalFile.listen(function (
  this: UI.AsyncActionType<API.ViewFile>,
  tth: string,
  isText: boolean,
  location: Location,
  sessionStore: any
) {
  const session = sessionStore.getSession(tth);
  if (session) {
    this.completed(location, session);
    return;
  }

  const that = this;
  SocketService.post(`${ViewFileConstants.SESSIONS_URL}/${tth}`, {
    text: isText,
  })
    .then((data: API.ViewFile) => that.completed(location, data))
    .catch(that.failed);
});

const onSessionCreated = (file: API.ViewFile) => {
  History.push({
    pathname: `/files/session/${file.id}`,
    state: {
      pending: true,
    },
  });
};

ViewFileActions.createSession.completed.listen(function (
  location: Location,
  file: API.ViewFile
) {
  onSessionCreated(file);
});

ViewFileActions.createSession.failed.listen(function (error: ErrorResponse) {
  NotificationActions.apiError('Failed to create viewed file', error);
});

ViewFileActions.openLocalFile.completed.listen(function (
  location: Location,
  file: API.ViewFile
) {
  onSessionCreated(file);
});

ViewFileActions.openLocalFile.failed.listen(function (error: ErrorResponse) {
  NotificationActions.apiError('Failed to create viewed file', error);
});

ViewFileActions.setRead.listen(function (
  this: UI.AsyncActionType<API.ViewFile>,
  session: API.ViewFile
) {
  const that = this;
  SocketService.post(`${ViewFileConstants.SESSIONS_URL}/${session.id}/read`)
    .then(that.completed)
    .catch(that.failed);
});

const ViewFileActionsDecorated = SessionActionDecorator(
  ViewFileActions,
  ViewFileConstants.SESSIONS_URL
);

export default ViewFileActionsDecorated as UI.RefluxActionListType<void>;
