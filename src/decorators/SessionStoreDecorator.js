import SocketStore from 'stores/SocketStore'
import LoginStore from 'stores/LoginStore'

import React from 'react'

export default function(store, fetchAction) {
  /*let socketSubscriptions = [];
  let hasSocket = false;

  const addSocketListener = (apiModuleUrl, event, callback, entityId) => {
    let subscription = SocketStore.addSocketListener(apiModuleUrl, event, callback, entityId);
    socketSubscriptions.push(subscription);
    return subscription;
  };

  const removeSocketListeners = () => { 
    socketSubscriptions.forEach(f => f())
    socketSubscriptions = [];
  };

  const _loginStoreListener = (loginState) => {
  	if (loginState.socketAuthenticated) {
  		if (store.hasSocket) {
  			return;
  		}

  		hasSocket = true;
  		if (store.onSocketConnected) {
  			store.onSocketConnected(addSocketListener);
  		}
  	} else {
  		if (!hasSocket) {
  			return;
  		}

  		socketSubscriptions = [];
  		hasSocket = false;

  		if (store.onSocketDisconnected) {
  			store.onSocketDisconnected();
  		}
  	}
  };

  store.listenTo(LoginStore, _loginStoreListener);
  //return store;
  return Object.assign(store,  {
    addSocketListener: addSocketListener,
    removeSocketListeners: removeSocketListeners
  });*/

  let sessions = [];

  fetchAction.listen(data => {
    sessions = data;
    store.trigger(sessions);
  });

  store.countUnreadSessions = () => {
    return sessions.reduce((count, session) => session.unread_count > 0 ? count + 1 : count, 0);
  }

  store.getSession = (id) => {
    return sessions.find(session => session.id == id);
  }

  store.getSessions = () => {
    return sessions;
  }

  store._onSessionCreated = (data) =>  {
    sessions = React.addons.update(sessions, {$push: [data]});
    store.trigger(sessions);
  }

  store._onSessionUpdated = (data, id) => {
    const session = store.getSession(id);
    sessions[sessions.indexOf(session)] = React.addons.update(session, {$merge: data});
    store.trigger(sessions);
  }

  store._onSessionRemoved = (data) => {
    const index = sessions.indexOf(store.getSession(data.id));
    sessions = React.addons.update(sessions, {$splice: [[index, 1]]});
    store.trigger(sessions);
  }

  return store;
};