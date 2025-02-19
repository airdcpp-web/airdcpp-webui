import { Lens, lens } from '@dhmk/zustand-lens';
import SystemConstants from 'constants/SystemConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

export const createActivitySlice = () => {
  const createSlice: Lens<UI.ActivitySlice, UI.Store> = (set, get, api) => {
    const slice = {
      away: API.AwayEnum.OFF,
      userActive: false,

      setUserActive: (active: boolean) => {
        set({ userActive: active });
      },

      setAway: (data: API.AwayState) => {
        set({ away: data.id });
      },
    };

    return slice;
  };

  return createSlice;
};

export const initActivityStore = (store: UI.Store, { socket }: UI.StoreInitData) => {
  const url = SystemConstants.MODULE_URL;
  socket.addListener(url, SystemConstants.AWAY_STATE, store.activity.setAway);
};

export const createActivityStore = () => {
  return lens<UI.ActivitySlice, UI.Store>((...a) => ({
    ...createActivitySlice()(...a),
  }));
};
