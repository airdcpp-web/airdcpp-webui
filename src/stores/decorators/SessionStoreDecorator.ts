import update from 'immutability-helper';

import { checkUnread } from 'utils/MessageUtils';
import { getSessionUrgencies, messageSessionMapper, simpleSessionMapper } from 'utils/UrgencyUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';


type SessionType = UI.SessionItem;

const SessionStoreDecorator = function (store: any, actions: any, messageUrgencyMappings: UI.UrgencyCountMap) {
  let sessions: Array<SessionType> = [];
  let activeSessionId: API.IdType | null = null;

  actions.sessionChanged.listen((session: SessionType | null) => {
    activeSessionId = session ? session.id : null;
  });

  actions.fetchSessions.completed.listen((data: SessionType[]) => {
    sessions = data;
    store.trigger(sessions);
  });

  store.getItemUrgencies = (item: SessionType) => {
    if (messageUrgencyMappings) {
      return messageSessionMapper(item as UI.MessageSessionItem, messageUrgencyMappings);
    }

    return simpleSessionMapper(item as UI.ReadableSessionItem);
  };

  store.getTotalUrgencies = () => {
    return getSessionUrgencies(sessions, store.getItemUrgencies);
  };

  store.getSession = (id: API.IdType) => {
    return sessions.find(session => session.id === id);
  };

  store.getSessions = () => {
    return sessions;
  };

  store.getActiveSessionId = () => activeSessionId;

  store._onSessionCreated = (data: SessionType) =>	{
    sessions = update(sessions, { $push: [ data ] });
    store.trigger(sessions);
  };

  store._onSessionUpdated = (updatedProperties: UI.SessionUpdateProperties, sessionId: API.IdType | undefined) => {
    //if (!id) {
      // It's not a submodule
    //  id = data.id;
    //}

    /*let updatedSessionData = {
      ...updatedProperties,
      id: updatedProperties.id ? updatedProperties.id : sessionId,
    };*/

    const id = updatedProperties.id ? updatedProperties.id : sessionId!;

    const session = store.getSession(id);
    if (!session) {
      // May happen before the sessions have been fetched
      console.warn('Update received for a non-existing session', updatedProperties);
      return;
    }

    // Active tab?
    if (id === activeSessionId) {
      updatedProperties = checkUnread(updatedProperties, actions, id);
    }

    sessions[sessions.indexOf(session)] = update(session, { $merge: updatedProperties });
    store.trigger(sessions);
  };

  store._onSessionRemoved = (data: SessionType) => {
    const index = sessions.indexOf(store.getSession(data.id));
    sessions = update(sessions, { $splice: [ [ index, 1 ] ] });
    store.trigger(sessions);
  };

  store.onSocketDisconnected = () => {
    sessions = [];
    activeSessionId = null;
  };

  return store;
};

export default SessionStoreDecorator;
