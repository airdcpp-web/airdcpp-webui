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
import { hasAccess } from '@/utils/AuthUtils';

interface Readable {
  setRead?: UI.BasicReadHandler;
}

export const toEventCacheMessage = (message: API.StatusMessage): UI.MessageListItem => {
  return {
    log_message: message,
  };
};

const createEventSlice = () => {
  const createSlice: Lens<UI.EventSlice & Readable, UI.SessionStore> = (
    set,
    get,
    api,
  ) => {
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

export const initEventStore = async (
  sessionStore: UI.SessionStore,
  { socket, login }: UI.SessionStoreInitData,
) => {
  if (hasAccess(login, API.AccessEnum.EVENTS_VIEW)) {
    const url = EventConstants.MODULE_URL;

    await socket.addListener(
      url,
      EventConstants.MESSAGE,
      sessionStore.events.onLogMessage,
    );
    await socket.addListener(
      url,
      EventConstants.COUNTS,
      sessionStore.events.onMessageCountsReceived,
    );

    const { events } = sessionStore;
    events.setReadHandler(() => {
      EventAPIActions.setRead(socket).catch((error) => {
        console.error(`Failed to mark events as read`, error);
      });
    });
  }
};

export const EventStoreSelector = (state: UI.SessionStore) => state.events;

export const createEventStore = () => {
  return lens<UI.EventSlice, UI.SessionStore>((...a) => ({
    ...createEventSlice()(...a),
  }));
};
