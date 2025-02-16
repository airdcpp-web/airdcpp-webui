import * as API from 'types/api';
import * as UI from 'types/ui';

import { ChatroomUrgencies, PrivateMessageUrgencies } from 'constants/UrgencyConstants';
import { createSessionSlice } from './decorators/sessionSlice';
import { createMessageSlice } from './decorators/messageSlice';
import { lens } from '@dhmk/zustand-lens';
import { PrivateChatAPIActions } from 'actions/store/PrivateChatActions';
import PrivateChatConstants from 'constants/PrivateChatConstants';
import { createSessionSliceSocketListener } from './decorators/sliceSocketListener';

const PrivateChatSessionUrgencyGetter = (session: API.PrivateChat) =>
  session.user.flags.includes('bot') ? ChatroomUrgencies : PrivateMessageUrgencies;

const createPrivateChatStore = (init: UI.StoreInitData) => {
  const addSocketListener = createSessionSliceSocketListener(
    init,
    PrivateChatConstants.MODULE_URL,
    'private_chat',
    API.AccessEnum.PRIVATE_CHAT_VIEW,
  );
  return lens<UI.PrivateChatStore, UI.Store>((...a) => ({
    ...createSessionSlice<API.PrivateChat>(
      init,
      PrivateChatAPIActions.setRead,
      addSocketListener,
      PrivateChatSessionUrgencyGetter,
    )(...a),
    messages: createMessageSlice(addSocketListener),
  }));
};

export const PrivateChatStoreSelector: UI.MessageStoreSelector<API.PrivateChat> = (
  state,
) => state.privateChats;

export default createPrivateChatStore;
