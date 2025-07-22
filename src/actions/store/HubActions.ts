import HubConstants from '@/constants/HubConstants';

import * as API from '@/types/api';
// import * as UI from '@/types/ui';

import ChatActionDecorator from './decorators/ChatActionDecorator';
import SessionActionDecorator from './decorators/SessionActionDecorator';
import { SessionCreatorDecorator } from './decorators/SessionCreatorDecorator';

interface CreateSessionProps {
  hubUrl: string;
}

const createSession = SessionCreatorDecorator<API.Hub, CreateSessionProps>({
  existingSessionGetter: ({ hubUrl }, sessionStore) =>
    sessionStore.hubs.getSessionByUrl(hubUrl),
  sectionUrlPath: '/hubs',
  createHandler: ({ hubUrl }, socket) => {
    return socket.post<API.Hub>(HubConstants.SESSIONS_URL, {
      hub_url: hubUrl,
    });
  },
});

export const HubAPIActions = {
  createSession,
  ...ChatActionDecorator(HubConstants.SESSIONS_URL),
  ...SessionActionDecorator(HubConstants.SESSIONS_URL),
};
