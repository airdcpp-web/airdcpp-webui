import update from 'immutability-helper';

import { checkUnreadSessionInfo } from 'utils/MessageUtils';
import { getSessionUrgencies, messageSessionMapper, simpleSessionMapper } from 'utils/UrgencyUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';


type SessionType = UI.SessionItemBase & UI.UnreadInfo;

const SessionStoreDecorator = function (
  store: any, 
  actions: UI.RefluxActionListType<SessionType>, 
  messageUrgencyMappings: UI.UrgencyCountMap
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

  const Decorator = {
    getItemUrgencies: (item: SessionType) => {
      if (messageUrgencyMappings) {
        return messageSessionMapper(item as UI.MessageCounts, messageUrgencyMappings);
      }

      return simpleSessionMapper(item as UI.ReadStatus);
    },

    getTotalUrgencies: () => {
      return getSessionUrgencies(sessions, store.getItemUrgencies);
    },

    getSession: (id: API.IdType) => {
      return sessions.find(session => session.id === id);
    },

    getSessions: () => {
      return sessions;
    },

    isInitialized: () => {
      return isInitialized;
    },

    getActiveSessionId: () => activeSessionId,

    _onSessionCreated: (data: SessionType) =>	{
      sessions = update(sessions, { $push: [ data ] });
      store.trigger(sessions);
    },

    _onSessionUpdated: (updatedProperties: Partial<SessionType>, sessionId: API.IdType | undefined) => {
      const id = updatedProperties.id ? updatedProperties.id : sessionId!;

      const session: SessionType = store.getSession(id);
      if (!session) {
        // May happen before the sessions have been fetched
        console.warn('Update received for a non-existing session', updatedProperties);
        return;
      }

      // Active tab?
      if (id === activeSessionId && (updatedProperties.message_counts || updatedProperties.hasOwnProperty('read'))) {
        updatedProperties = checkUnreadSessionInfo(
          updatedProperties as UI.UnreadInfo, 
          () => actions.setRead({ id })
        );
      }

      const index = sessions.indexOf(session);
      sessions = update(sessions, {
        [index]: {
          $merge: updatedProperties as SessionType
        }
      });

      store.trigger(sessions);
    },

    _onSessionRemoved: (data: SessionType) => {
      const index = sessions.indexOf(store.getSession(data.id));
      sessions = update(sessions, { $splice: [ [ index, 1 ] ] });
      store.trigger(sessions);
    },

    onSocketDisconnected: () => {
      sessions = [];
      activeSessionId = null;
      isInitialized = false;
    },
  };

  return Object.assign(store, Decorator);
};

//type SessionStoreDecorator = typeof Decorator;

export default SessionStoreDecorator;
