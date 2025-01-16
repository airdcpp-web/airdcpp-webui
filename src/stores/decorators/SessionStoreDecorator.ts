import update from 'immutability-helper';

import { checkUnreadSessionInfo } from 'utils/MessageUtils';
import {
  getSessionUrgencies,
  messageSessionMapper,
  simpleSessionMapper,
} from 'utils/UrgencyUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';

import ActivityStore, { ActivityState } from 'stores/reflux/ActivityStore';
import { IdType } from 'types/api';

export type SessionUrgencyCountMapper<SessionT extends UI.SessionType> = (
  session: SessionT,
) => UI.ChatMessageUrcencies | UI.StatusMessageUrcencies;

const SessionStoreDecorator = function <SessionT extends UI.SessionType>(
  store: any,
  actions: UI.RefluxActionListType<SessionT>,
  messageUrgencyMappings: SessionUrgencyCountMapper<SessionT> | undefined = undefined,
) {
  let sessions: Array<SessionT> = [];
  let activeSessionId: API.IdType | null = null;
  let isInitialized = false;

  (actions.sessionChanged as any).listen((session: SessionT | null) => {
    activeSessionId = session ? session.id : null;
  });

  (actions.fetchSessions as any).completed.listen((data: SessionT[]) => {
    isInitialized = true;
    sessions = data;
    store.trigger(sessions);
  });

  const isUnreadUpdate = (updatedProperties: Partial<SessionT>) => {
    return updatedProperties.message_counts || updatedProperties.hasOwnProperty('read');
  };

  const checkReadState = (
    id: IdType,
    updatedProperties: Partial<SessionT>,
  ): Partial<SessionT> => {
    // Active tab? Mark as read
    if (
      id === activeSessionId &&
      ActivityStore.userActive &&
      isUnreadUpdate(updatedProperties)
    ) {
      const ret = checkUnreadSessionInfo(updatedProperties as UI.UnreadInfo, () =>
        actions.setRead({ id }),
      );

      return ret as Partial<SessionT>;
    }

    return updatedProperties;
  };

  const DecoratorPublic: UI.SessionStore<SessionT> = {
    getItemUrgencies: (item: SessionT) => {
      if (messageUrgencyMappings) {
        return messageSessionMapper(
          item as UI.MessageCounts,
          messageUrgencyMappings(item),
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
  };

  const Decorator = {
    ...DecoratorPublic,
    _onSessionCreated: (data: SessionT) => {
      sessions = update(sessions, { $push: [data] });
      store.trigger(sessions);
    },

    _onSessionUpdated: (
      updatedPropertiesInitial: Partial<SessionT>,
      sessionId: API.IdType | undefined,
    ) => {
      const id = updatedPropertiesInitial.id ? updatedPropertiesInitial.id : sessionId!;

      const session: SessionT = store.getSession(id);
      if (!session) {
        // May happen before the sessions have been fetched
        console.warn(
          'Update received for a non-existing session',
          updatedPropertiesInitial,
        );
        return;
      }

      const updatedProperties = checkReadState(id, updatedPropertiesInitial);

      const index = sessions.indexOf(session);
      //@ts-ignore
      sessions = update(sessions, {
        [index]: {
          $merge: updatedProperties,
        },
      });

      store.trigger(sessions);
    },

    _onSessionRemoved: (data: SessionT) => {
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
