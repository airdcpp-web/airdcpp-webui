import * as API from '@/types/api';
import * as UI from '@/types/ui';

import {
  HubMessageNotifyUrgencies,
  HubMessageUrgencies,
} from '@/constants/UrgencyConstants';
import { createSessionSlice, initSessionSlice } from './decorators/sessionSlice';
import { createMessageSlice, initMessageSlice } from './decorators/messageSlice';
import { lens } from '@dhmk/zustand-lens';
import { HubAPIActions } from '@/actions/store/HubActions';
import HubConstants from '@/constants/HubConstants';
import { createSessionSliceSocketListener } from './decorators/sliceSocketListener';

const HubSessionUrgencyGetter = (hub: API.Hub) =>
  hub.settings.use_main_chat_notify ? HubMessageNotifyUrgencies : HubMessageUrgencies;

export const createHubSlice: UI.PartialLensSlice<
  UI.HubSessionSlice,
  UI.HubStore,
  UI.SessionStore
> = (set, get, api) => ({
  hasConnectedHubs: () => {
    const { sessions } = get();
    if (!sessions) {
      return false;
    }

    return !!sessions.find(
      (hub: API.Hub) => hub.connect_state.id === API.HubConnectStateEnum.CONNECTED,
    );
  },

  getSessionByUrl: (hubUrl: string) => {
    const { sessions } = get();
    if (!sessions) {
      return undefined;
    }

    return sessions.find((hub) => hub.hub_url === hubUrl);
  },
});

const createHubStore = () => {
  return lens<UI.HubStore, UI.SessionStore>((...a) => {
    const sessionSlice = createSessionSlice<API.Hub>(HubSessionUrgencyGetter)(...a);

    const messageSlice = createMessageSlice();

    return {
      ...createHubSlice(...a),
      ...sessionSlice,
      messages: messageSlice,
    };
  });
};

export const initHubStore = (
  sessionStore: UI.SessionStore,
  init: UI.SessionStoreInitData,
) => {
  // Init listeners
  const addSocketListener = createSessionSliceSocketListener(
    init,
    HubConstants.MODULE_URL,
    'hub',
    API.AccessEnum.HUBS_VIEW,
  );

  initSessionSlice(sessionStore.hubs, HubAPIActions, addSocketListener);
  initMessageSlice(sessionStore.hubs.messages, addSocketListener);
};

export const HubStoreSelector: UI.MessageStoreSelector<API.Hub> = (state) => state.hubs;

export default createHubStore;
