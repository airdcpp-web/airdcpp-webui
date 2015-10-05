import SocketStore from 'stores/SocketStore'
import LoginStore from 'stores/LoginStore'

export default function(store) {
  let socketSubscriptions = [];
  let hasSocket = false;

  const addSocketListener = (apiModuleUrl, event, callback) => {
    let subscription = SocketStore.addSocketListener(apiModuleUrl, event, callback);
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
  });
};