import * as API from '@/types/api';
import * as UI from '@/types/ui';

type SessionType = UI.SessionItemBase & UI.UnreadInfo;

export const SessionScrollPositionKeeper = function () {
  let positions: Record<string, number | undefined> = {};

  const Decorator = {
    getScrollData: (entityId: API.IdType) => {
      const ret = positions[entityId];
      // console.log(`Getting scroll position ${ret} for session ${entityId}`);
      return ret;
    },

    setScrollData: (data: number, entityId: API.IdType) => {
      // console.log(`Setting scroll position ${data} for session ${entityId}`);
      positions[entityId] = data;
    },

    _onSessionRemoved: (data: SessionType) => {
      positions[data.id] = undefined;
    },

    onSocketDisconnected: () => {
      positions = {};
    },
  };

  return Decorator;
};

export const BrowserSessionScrollPositionKeeper = function () {
  let positions: Record<string, Record<string, number>> = {};

  const Decorator = {
    getScrollData: (entityId: API.IdType, viewId: string | number) => {
      if (!positions[entityId]) {
        return undefined;
      }

      const ret = positions[entityId][viewId];
      // console.log(`Getting scroll position ${ret} for session ${entityId} (view ${viewId})`);
      return ret;
    },

    setScrollData: (data: number, entityId: API.IdType, viewId: string | number) => {
      // console.log(`Setting scroll position ${data} for session ${entityId} (view ${viewId})`);
      positions[entityId] = positions[entityId] || {};
      positions[entityId][viewId] = data;
    },

    _onSessionRemoved: (data: UI.SessionItemBase) => {
      const { [data.id]: removedPositions, ...positionsNew } = positions;
      positions = positionsNew;
    },

    onSocketDisconnected: () => {
      positions = {};
    },
  };

  return Decorator;
};
