//import Reflux from 'reflux';
import React from 'react';

export default function(store, actions) {
  let messages = {};
  let activeSession = null;

  const addMessage = (id, message) => {
    let userMessages = messages[id] || [];
    messages[id] = React.addons.update(userMessages, {$push: [ message ]});
    store.trigger(messages[id], id);
  }

  const onFetchMessagesCompleted = (id, data) => {
    messages[id] = data;
    store.trigger(messages[id], id);
  }

  const onSessionChanged = (id) => {
    activeSession = id;
  }

  store._onChatMessage = (data, id) => {
    if (!data.is_read && id === activeSession) {
      actions.setRead(id);
      data.is_read = true;
    }

    addMessage(id, { chat_message: data });
  }

  store._onStatusMessage = (data, id) => {
    addMessage(id, { log_message: data });
  }

  store.getMessages = () => messages

  store.listenTo(actions.fetchMessages.completed, onFetchMessagesCompleted);
  store.listenTo(actions.sessionChanged, onSessionChanged);
  return store;
}
