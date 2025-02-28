import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { lens } from '@dhmk/zustand-lens';

import { ChatroomUrgencies, PrivateMessageUrgencies } from '@/constants/UrgencyConstants';
import { createSessionSlice, initSessionSlice } from './decorators/sessionSlice';
import { createMessageSlice, initMessageSlice } from './decorators/messageSlice';

import { PrivateChatAPIActions } from '@/actions/store/PrivateChatActions';
import PrivateChatConstants from '@/constants/PrivateChatConstants';
import { createSessionSliceSocketListener } from './decorators/sliceSocketListener';

const PrivateChatSessionUrgencyGetter = (session: API.PrivateChat) =>
  session.user.flags.includes('bot') ? ChatroomUrgencies : PrivateMessageUrgencies;

const createPrivateChatStore = () => {
  return lens<UI.PrivateChatStore, UI.SessionStore>((...a) => {
    const sessionSlice = createSessionSlice<API.PrivateChat>(
      PrivateChatSessionUrgencyGetter,
    )(...a);

    const messageSlice = createMessageSlice();

    return {
      ...sessionSlice,
      messages: messageSlice,
    };
  });
};

export const initPrivateChatStore = (
  sessionStore: UI.SessionStore,
  init: UI.SessionStoreInitData,
) => {
  // Init listeners
  const addSocketListener = createSessionSliceSocketListener(
    init,
    PrivateChatConstants.MODULE_URL,
    'private_chat',
    API.AccessEnum.PRIVATE_CHAT_VIEW,
  );

  initSessionSlice(sessionStore.privateChats, PrivateChatAPIActions, addSocketListener);
  initMessageSlice(sessionStore.privateChats.messages, addSocketListener);
};

export const PrivateChatStoreSelector: UI.MessageStoreSelector<API.PrivateChat> = (
  state,
) => state.privateChats;

export default createPrivateChatStore;
