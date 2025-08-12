import { lens } from '@dhmk/zustand-lens';
import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { produce } from 'immer';

export const createSessionScrollSlice = () => {
  interface SessionScrollSlice extends UI.SessionScrollHandler {
    positions: Record<string, number | undefined>;
  }

  const createSlice = lens<SessionScrollSlice, UI.SessionStore>((set, get) => {
    const slice = {
      positions: {} as SessionScrollSlice['positions'],

      getScrollData: (entityId: API.IdType) => {
        const positions = get().positions;
        const ret = positions[entityId];
        // console.log(`[SCROLL] Getting scroll position ${ret} for session ${entityId}`);
        return ret;
      },

      setScrollData: (data: number, entityId: API.IdType) => {
        // console.log(`[SCROLL] Setting scroll position ${data} for session ${entityId}`);
        set(
          produce<SessionScrollSlice>((state) => {
            state.positions[entityId] = data;
          }),
        );
      },

      onSessionRemoved: (data: UI.SessionItemBase) => {
        set(
          produce<SessionScrollSlice>((state) => {
            delete state.positions[data.id];
          }),
        );
      },
    };

    return slice;
  });

  return createSlice;
};

export const initSessionScrollSlice = async (
  scrollSlice: UI.SessionScrollHandler,
  { addSocketListener }: UI.SessionInitData,
) => {
  await addSocketListener('removed', scrollSlice.onSessionRemoved);
};

export const createBasicScrollSlice = () => {
  interface BasicScrollSlice extends UI.ScrollHandler {
    scrollPosition: number | undefined;
  }

  const createSlice = lens<BasicScrollSlice, UI.SessionStore>((set, get) => {
    const slice = {
      scrollPosition: undefined,

      getScrollData: () => {
        //console.log(
        //  `[SCROLL] Getting scroll position ${get().scrollPosition} for events`,
        //);
        return get().scrollPosition;
      },

      setScrollData: (data: number) => {
        //console.log(`[SCROLL] Setting scroll position ${data} for events`);
        set({
          scrollPosition: data,
        });
      },
    };

    return slice;
  });

  return createSlice;
};
