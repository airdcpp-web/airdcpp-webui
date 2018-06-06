import update from 'immutability-helper';

import { checkUnread } from 'utils/MessageUtils';
import { getSessionUrgencies, messageSessionMapper, simpleSessionMapper } from 'utils/UrgencyUtils';

const SessionStoreDecorator = function (store, actions, messageUrgencyMappings) {
  let sessions = [];
  let activeSession = null;

  actions.sessionChanged.listen(id => {
    activeSession = id;
  });

  actions.fetchSessions.completed.listen(data => {
    sessions = data;
    store.trigger(sessions);
  });

  store.getItemUrgencies = (item) => {
    if (messageUrgencyMappings) {
      return messageSessionMapper(item, messageUrgencyMappings);
    }

    return simpleSessionMapper(item);
  };

  store.getTotalUrgencies = () => {
    return getSessionUrgencies(sessions, store.getItemUrgencies);
  };

  store.getSession = (id) => {
    return sessions.find(session => session.id === id);
  };

  store.getSessions = () => {
    return sessions;
  };

  store.getActiveSession = () => activeSession;

  store._onSessionCreated = (data) =>	{
    sessions = update(sessions, { $push: [ data ] });
    store.trigger(sessions);
  };

  store._onSessionUpdated = (data, id) => {
    if (!id) {
      // It's not a submodule
      id = data.id;
    }

    const session = store.getSession(id);
    if (!session) {
      // May happen before the sessions have been fetched
      console.log('Update received for a non-existing session', data);
      return;
    }

    // Active tab?
    if (id === activeSession) {
      data = checkUnread(data, actions, id);
    }

    sessions[sessions.indexOf(session)] = update(session, { $merge: data });
    store.trigger(sessions);
  };

  store._onSessionRemoved = (data) => {
    const index = sessions.indexOf(store.getSession(data.id));
    sessions = update(sessions, { $splice: [ [ index, 1 ] ] });
    store.trigger(sessions);
  };

  store.onSocketDisconnected = () => {
    sessions = [];
    activeSession = null;
  };

  return store;
};

export default SessionStoreDecorator;
