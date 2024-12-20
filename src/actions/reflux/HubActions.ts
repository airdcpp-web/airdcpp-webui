//@ts-ignore
import Reflux from 'reflux';
import HubConstants from 'constants/HubConstants';
import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';

import ChatActionDecorator from './decorators/ChatActionDecorator';
import SessionActionDecorator from './decorators/SessionActionDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';
import { NavigateFunction, Location } from 'react-router';

const HubActionConfig: UI.RefluxActionConfigList<API.Hub> = [
  {
    createSession: {
      asyncResult: true,
    },
  },
];

const HubActions = Reflux.createActions(HubActionConfig);

interface CreateSessionProps {
  location: Location;
  sessionStore: any;
  navigate: NavigateFunction;
}

HubActions.createSession.listen(function (
  this: UI.AsyncActionType<API.Hub>,
  hubUrl: string,
  props: CreateSessionProps,
) {
  const { sessionStore } = props;
  const session = sessionStore.getSessionByUrl(hubUrl);
  if (session) {
    this.completed(session, props);
    return;
  }

  const that = this;
  SocketService.post(HubConstants.SESSIONS_URL, {
    hub_url: hubUrl,
  })
    .then((data) => that.completed(data, props))
    .catch(that.failed);
});

HubActions.createSession.completed.listen(function (
  session: API.Hub,
  { navigate }: CreateSessionProps,
) {
  navigate(`/hubs/session/${session.id}`, {
    state: {
      pending: true,
    },
  });
});

HubActions.createSession.failed.listen(function (error: ErrorResponse) {
  NotificationActions.apiError('Failed to create hub session', error);
});

const HubActionsDecorated = SessionActionDecorator(
  ChatActionDecorator(HubActions, HubConstants.SESSIONS_URL),
  HubConstants.SESSIONS_URL,
);

export default HubActionsDecorated as UI.RefluxActionListType<void>;
