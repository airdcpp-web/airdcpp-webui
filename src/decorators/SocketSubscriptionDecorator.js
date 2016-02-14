import SocketService from 'services/SocketService';
import LoginStore from 'stores/LoginStore';


const SocketSubscriptionDecorator = (store, access, listenToFunction = 'listenTo') => {
	let socketSubscriptions = [];
	let hasSocket = false;

	const addSocketListener = (apiModuleUrl, event, callback, entityId) => {
		let subscription = SocketService.addSocketListener(apiModuleUrl, event, callback, entityId);
		socketSubscriptions.push(subscription);
		return subscription;
	};

	const removeSocketListeners = (entityExists) => { 
		socketSubscriptions.forEach(f => f(entityExists));
		socketSubscriptions = [];
	};

	const _onSocketConnected = () => {
		if (access && !LoginStore.hasAccess(access)) {
			return;
		}

		hasSocket = true;

		if (store.onSocketConnected) {
			store.onSocketConnected(addSocketListener);
		}
	};

	const _onSocketDisconnected = () => {
		removeSocketListeners();
		hasSocket = false;

		if (store.onSocketDisconnected) {
			store.onSocketDisconnected();
		}
	};

	const _loginStoreListener = (loginState) => {
		if (loginState.socketAuthenticated) {
			if (hasSocket) {
				return;
			}

			_onSocketConnected();
		} else {
			if (!hasSocket) {
				return;
			}

			_onSocketDisconnected();
		}
	};

	// Listen to authentication status changes
	store[listenToFunction](LoginStore, _loginStoreListener);

	// We have a socket already (happens when used together with the socket subscription mixin)
	if (LoginStore.socketAuthenticated) {
		setTimeout(_onSocketConnected);
	}

	return Object.assign(store,	{
		addSocketListener,
		removeSocketListeners,
	});
};

export default SocketSubscriptionDecorator;
