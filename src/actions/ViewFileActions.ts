'use strict';
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


const ViewFileActions = Reflux.createActions([
  { 'createSession': { asyncResult: true } },
  { 'setRead': { asyncResult: true } },
]);

interface ViewFileData {
  itemInfo: API.ViewFile;
  user: API.HintedUserBase;
}

ViewFileActions.createSession.listen(function (
  this: UI.AsyncActionType<API.ViewFile>, 
  { itemInfo, user }: ViewFileData, 
  isText: boolean, 
  location: Location, 
  sessionStore: any
) {
  let session = sessionStore.getSession(itemInfo.id);
  if (session) {
    this.completed(location, itemInfo, session);
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

  let that = this;
  SocketService.post(ViewFileConstants.SESSIONS_URL, fileData)
    .then((data: API.ViewFile) => that.completed(location, data))
    .catch(that.failed);
});

ViewFileActions.createSession.completed.listen(function (
  location: Location, 
  file: API.ViewFile
) {
  History.push({
    pathname: `/files/session/${file.id}`, 
    state: {
      pending: true
    },
  });
});

ViewFileActions.createSession.failed.listen(function (error: ErrorResponse) {
  NotificationActions.apiError('Failed to create viewed file', error);
});

ViewFileActions.setRead.listen(function (this: UI.AsyncActionType<API.ViewFile>, session: API.ViewFile) {
  let that = this;
  SocketService.post(`${ViewFileConstants.SESSIONS_URL}/${session.id}/read`)
    .then(that.completed)
    .catch(that.failed);
});

export default SessionActionDecorator(ViewFileActions, ViewFileConstants.SESSIONS_URL, API.AccessEnum.VIEW_FILE_EDIT);
