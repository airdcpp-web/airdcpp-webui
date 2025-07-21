import EventConstants, { SeverityEnum } from '@/constants/EventConstants';

import { LogMessageUrgencies } from '@/constants/UrgencyConstants';
import { toUrgencyMap } from '@/utils/UrgencyUtils';

import {
  mergeCacheMessages,
  pushMessage,
  checkUnreadCacheInfo,
  checkSplice,
} from '@/utils/MessageUtils';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { Lens, lens } from '@dhmk/zustand-lens';
import { createBasicScrollSlice } from './decorators/scrollSlice';
import { EventAPIActions } from '@/actions/store/EventActions';

interface Readable {
  setRead?: UI.BasicReadHandler;
}

export const toEventCacheMessage = (message: API.StatusMessage): UI.MessageListItem => {
  return {
    log_message: message,
  };
};

const createEventSlice = () => {
  const createSlice: Lens<UI.EventSlice & Readable, UI.Store> = (set, get, api) => {
    const checkReadState = (cacheInfoNew: API.StatusMessageCounts) => {
      if (get().viewActive && api.getState().activity.userActive) {
        cacheInfoNew = checkUnreadCacheInfo(cacheInfoNew, () => {
          const readCallback = get().setRead;
          if (readCallback) {
            readCallback();
          } else {
            console.error('Session store not initialized');
          }
        }) as API.StatusMessageCounts;
      }

      return cacheInfoNew;
    };

    const slice = {
      logMessages: null,
      messageCacheInfo: undefined,
      viewActive: false,
      isInitialized: false,

      setRead: undefined,

      scroll: createBasicScrollSlice(),

      setViewActive: (active: boolean) => {
        set({
          viewActive: active,
        });
      },

      onMessagesFetched: (messages: API.StatusMessage[]) => {
        set({
          logMessages: mergeCacheMessages(
            messages.map(toEventCacheMessage),
            get().logMessages || undefined,
          ),
          isInitialized: true,
        });
      },

      onLogMessage: (data: API.StatusMessage) => {
        if (data.severity === SeverityEnum.NOTIFY) {
          return;
        }

        set({
          logMessages: pushMessage(
            toEventCacheMessage(data),
            get().logMessages || undefined,
          ),
        });
      },

      onMessageCountsReceived(cacheInfoNew: API.StatusMessageCounts) {
        cacheInfoNew = checkReadState(cacheInfoNew);

        set({
          logMessages: checkSplice(get().logMessages || undefined, cacheInfoNew.total),
          messageCacheInfo: cacheInfoNew,
        });
      },

      getTotalUrgencies: () => {
        const { messageCacheInfo } = get();
        if (!messageCacheInfo) {
          return null;
        }

        return toUrgencyMap(messageCacheInfo.unread, LogMessageUrgencies);
      },

      setReadHandler: (handler: UI.BasicReadHandler) => {
        set(() => ({
          setRead: handler,
        }));
      },
    };

    return slice;
  };

  return createSlice;
};

export const initEventStore = (store: UI.Store, { socket, login }: UI.StoreInitData) => {
  if (login.hasAccess(API.AccessEnum.EVENTS_VIEW)) {
    const url = EventConstants.MODULE_URL;
    socket.addListener(url, EventConstants.MESSAGE, store.events.onLogMessage);
    socket.addListener(url, EventConstants.COUNTS, store.events.onMessageCountsReceived);

    const { events } = store;
    events.setReadHandler(() => {
      EventAPIActions.setRead(socket).catch((error) => {
        console.error(`Failed to mark events as read`, error);
      });
    });
  }
};

export const EventStoreSelector = (state: UI.Store) => state.events;

export const createEventStore = () => {
  return lens<UI.EventSlice, UI.Store>((...a) => ({
    ...createEventSlice()(...a),
  }));
};
