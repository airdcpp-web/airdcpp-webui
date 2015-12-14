import SocketStore from 'stores/SocketStore';
import LoginStore from 'stores/LoginStore';

const SocketSubscriptionDecorator = (store, listenToFunction = 'listenTo') => {
	let socketSubscriptions = [];
	let hasSocket = false;

	const addSocketListener = (apiModuleUrl, event, callback, entityId) => {
		let subscription = SocketStore.addSocketListener(apiModuleUrl, event, callback, entityId);
		socketSubscriptions.push(subscription);
		return subscription;
	};

	const removeSocketListeners = () => { 
		socketSubscriptions.forEach(f => f());
		socketSubscriptions = [];
	};

	const onSocketAuthenticated = () => {
		if (store.hasSocket) {
			return;
		}

		hasSocket = true;
		if (store.onSocketConnected) {
			store.onSocketConnected(addSocketListener);
		}
	};

	const _loginStoreListener = (loginState) => {
		if (loginState.socketAuthenticated) {
			onSocketAuthenticated();
		} else {
			if (!hasSocket) {
				return;
			}


			removeSocketListeners();
			hasSocket = false;

			if (store.onSocketDisconnected) {
				store.onSocketDisconnected();
			}
		}
	};

	store[listenToFunction](LoginStore, _loginStoreListener);
	if (LoginStore.socketAuthenticated) {
		setTimeout(onSocketAuthenticated);
	}

	//return store;
	return Object.assign(store,	{
		addSocketListener: addSocketListener,
		removeSocketListeners: removeSocketListeners
	});
};

export default SocketSubscriptionDecorator;
