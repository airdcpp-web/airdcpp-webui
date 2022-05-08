//@ts-ignore
import Reflux from 'reflux';
import HubConstants from 'constants/HubConstants';
import SocketService from 'services/SocketService';

import History from 'utils/History';
import NotificationActions from 'actions/NotificationActions';

import ChatActionDecorator from './decorators/ChatActionDecorator';
import SessionActionDecorator from './decorators/SessionActionDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';
import { Location } from 'history';


const HubActionConfig: UI.RefluxActionConfigList<API.Hub> = [
  { 'createSession': { 
    asyncResult: true
  } },
];

const HubActions = Reflux.createActions(HubActionConfig);


HubActions.createSession.listen(function (
  this: UI.AsyncActionType<API.Hub>,
  location: Location, 
  hubUrl: string, 
  sessionStore: any
) {
  const session = sessionStore.getSessionByUrl(hubUrl);
  if (session) {
    this.completed(location, session);
    return;
  }

  const that = this;
  SocketService.post(HubConstants.SESSIONS_URL, {
    hub_url: hubUrl,
  })
    .then(that.completed.bind(that, location))
    .catch(that.failed);
});

HubActions.createSession.completed.listen(function (location: Location, session: API.Hub) {
  History.push({
    pathname: `/hubs/session/${session.id}`, 
    state: {
      pending: true
    },
  });
});

HubActions.createSession.failed.listen(function (error: ErrorResponse) {
  NotificationActions.apiError('Failed to create hub session', error);
});

const HubActionsDecorated = SessionActionDecorator(
  ChatActionDecorator(
    HubActions, 
    HubConstants.SESSIONS_URL
  ), 
  HubConstants.SESSIONS_URL
);

export default HubActionsDecorated as UI.RefluxActionListType<void>;
