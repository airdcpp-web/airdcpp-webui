import * as API from '@/types/api';
import * as UI from '@/types/ui';

import ChatActionDecorator from './decorators/ChatActionDecorator';
import SessionActionDecorator from './decorators/SessionActionDecorator';
import PrivateChatConstants from '@/constants/PrivateChatConstants';
import { changePrivateChatHubUrl } from '@/services/api/PrivateChatApi';
import { SessionCreatorDecorator } from './decorators/SessionCreatorDecorator';

export const createSession = SessionCreatorDecorator<API.PrivateChat, UI.ActionUserType>({
  existingSessionGetter: ({ cid }, store) => store.privateChats.getSession(cid),

  onExists: (session, user) => {
    if (!!user.hub_url && session.user.hub_url !== user.hub_url) {
      // TODO: error handling
      changePrivateChatHubUrl(session, user.hub_url);
    }
  },
  sectionUrlPath: '/messages',
  createHandler: (data, socket) => {
    return socket.post<API.PrivateChat>(PrivateChatConstants.SESSIONS_URL, {
      user: {
        cid: data.cid,
        hub_url: data.hub_url,
      },
    });
  },
});

export const PrivateChatAPIActions = {
  createSession,
  ...ChatActionDecorator(PrivateChatConstants.SESSIONS_URL),
  ...SessionActionDecorator(PrivateChatConstants.SESSIONS_URL),
};
