import * as API from 'types/api';
import * as UI from 'types/ui';

import {
  HubMessageNotifyUrgencies,
  HubMessageUrgencies,
} from 'constants/UrgencyConstants';
import { createSessionSlice } from './decorators/sessionSlice';
import { createMessageSlice } from './decorators/messageSlice';
import { lens } from '@dhmk/zustand-lens';
import { HubAPIActions } from 'actions/store/HubActions';
import HubConstants from 'constants/HubConstants';
import { createSessionSliceSocketListener } from './decorators/sliceSocketListener';

const HubSessionUrgencyGetter = (session: API.Hub) =>
  session.settings.use_main_chat_notify ? HubMessageNotifyUrgencies : HubMessageUrgencies;

export const createHubSlice: UI.LensSlice<UI.HubSessionSlice, UI.HubStore, UI.Store> = (
  set,
  get,
  api,
) => ({
  hasConnectedHubs: () => {
    const { sessions } = get();
    if (!sessions) {
      return false;
    }

    return !!sessions.find(
      (session: API.Hub) =>
        session.connect_state.id === API.HubConnectStateEnum.CONNECTED,
    );
  },

  getSessionByUrl: (hubUrl: string) => {
    const { sessions } = get();
    if (!sessions) {
      return undefined;
    }

    return sessions.find((session: API.Hub) => session.hub_url === hubUrl);
  },
});

const createHubStore = (init: UI.StoreInitData) => {
  const addSocketListener = createSessionSliceSocketListener(
    init,
    HubConstants.MODULE_URL,
    'hub',
    API.AccessEnum.HUBS_VIEW,
  );

  return lens<UI.HubStore, UI.Store>((...a) => ({
    ...createHubSlice(...a),
    ...createSessionSlice<API.Hub>(
      init,
      HubAPIActions.setRead,
      addSocketListener,
      HubSessionUrgencyGetter,
    )(...a),
    messages: createMessageSlice(addSocketListener),
  }));
};

export const HubStoreSelector: UI.MessageStoreSelector<API.Hub> = (state) => state.hubs;

export default createHubStore;
