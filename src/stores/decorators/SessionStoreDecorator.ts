import update from 'immutability-helper';

import { checkUnreadSessionInfo } from 'utils/MessageUtils';
import {
  getSessionUrgencies,
  messageSessionMapper,
  simpleSessionMapper,
} from 'utils/UrgencyUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';

import ActivityStore, { ActivityState } from 'stores/ActivityStore';
import { IdType } from 'types/api';

type SessionType = UI.SessionItemBase & UI.UnreadInfo;

export type SessionUrgencyCountMapper<SessionT extends SessionType> = (
  session: SessionT
) => UI.ChatMessageUrcencies | UI.StatusMessageUrcencies;

const SessionStoreDecorator = function <SessionT extends SessionType>(
  store: any,
  actions: UI.RefluxActionListType<SessionT>,
  messageUrgencyMappings: SessionUrgencyCountMapper<SessionT> | undefined = undefined
) {
  let sessions: Array<SessionType> = [];
  let activeSessionId: API.IdType | null = null;
  let isInitialized = false;

  (actions.sessionChanged as any).listen((session: SessionType | null) => {
    activeSessionId = session ? session.id : null;
  });

  (actions.fetchSessions as any).completed.listen((data: SessionType[]) => {
    isInitialized = true;
    sessions = data;
    store.trigger(sessions);
  });

  const isUnreadUpdate = (updatedProperties: Partial<SessionType>) => {
    return updatedProperties.message_counts || updatedProperties.hasOwnProperty('read');
  };

  const checkReadState = (id: IdType, updatedProperties: Partial<SessionType>) => {
    // Active tab? Mark as read
    if (
      id === activeSessionId &&
      ActivityStore.userActive &&
      isUnreadUpdate(updatedProperties)
    ) {
      return checkUnreadSessionInfo(updatedProperties as UI.UnreadInfo, () =>
        actions.setRead({ id })
      );
    }

    return updatedProperties;
  };

  const Decorator = {
    getItemUrgencies: (item: SessionT) => {
      if (messageUrgencyMappings) {
        return messageSessionMapper(
          item as UI.MessageCounts,
          messageUrgencyMappings(item)
        );
      }

      return simpleSessionMapper(item as UI.ReadStatus);
    },

    getTotalUrgencies: () => {
      return getSessionUrgencies(sessions, store.getItemUrgencies);
    },

    getSession: (id: API.IdType) => {
      return sessions.find((session) => session.id === id);
    },

    getSessions: () => {
      return sessions;
    },

    isInitialized: () => {
      return isInitialized;
    },

    getActiveSessionId: () => activeSessionId,

    _onSessionCreated: (data: SessionType) => {
      sessions = update(sessions, { $push: [data] });
      store.trigger(sessions);
    },

    _onSessionUpdated: (
      updatedProperties: Partial<SessionType>,
      sessionId: API.IdType | undefined
    ) => {
      const id = updatedProperties.id ? updatedProperties.id : sessionId!;

      const session: SessionType = store.getSession(id);
      if (!session) {
        // May happen before the sessions have been fetched
        console.warn('Update received for a non-existing session', updatedProperties);
        return;
      }

      updatedProperties = checkReadState(id, updatedProperties);

      const index = sessions.indexOf(session);
      sessions = update(sessions, {
        [index]: {
          $merge: updatedProperties as any,
        },
      });

      store.trigger(sessions);
    },

    _onSessionRemoved: (data: SessionType) => {
      if (store.scroll) {
        store.scroll._onSessionRemoved(data);
      }

      const index = sessions.indexOf(store.getSession(data.id));
      sessions = update(sessions, { $splice: [[index, 1]] });
      store.trigger(sessions);
    },

    onSocketDisconnected: () => {
      if (store.scroll) {
        store.scroll.onSocketDisconnected();
      }

      sessions = [];
      activeSessionId = null;
      isInitialized = false;
    },
  };

  const _activityStoreListener = (activityState: ActivityState) => {
    if (!!activeSessionId) {
      checkReadState(activeSessionId, store.getSession(activeSessionId));
    }
  };

  if ('listenTo' in store) {
    // Listen to authentication status changes (stores only)
    store.listenTo(ActivityStore, _activityStoreListener);
  }

  return Object.assign(store, Decorator);
};

export default SessionStoreDecorator;
