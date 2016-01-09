import SocketStore from 'stores/SocketStore';
import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';

// For React components
const SocketSubscriptionMixin = (sessionStore) => {
	let unsubscribe;

	const removeSocketSubscriptions = (props, removeSocketListeners) => {
		let entityExists = true;
		if (sessionStore) {
			entityExists = sessionStore.getSession(props.item.id) ? true : false;
		}

		removeSocketListeners(entityExists);
	};

	return SocketSubscriptionDecorator({
		componentWillMount() {
			if (SocketStore.socket) {
				this.onSocketConnected(this.addSocketListener);
			}
		},

		componentDidUpdate(prevProps) {
			if (!sessionStore) {
				return;
			}

			if (this.props.item.id !== prevProps.item.id) {
				removeSocketSubscriptions(prevProps, this.removeSocketListeners);
				this.onSocketConnected(this.addSocketListener);
			}
		},

		// Emulates the listenTo property that stores have
		addStoreListener(store, bind) {
			unsubscribe = store.listen(bind);
		},

		componentWillUnmount() {
			removeSocketSubscriptions(this.props, this.removeSocketListeners);
			unsubscribe();
		}
	}, null, 'addStoreListener');
};

export default SocketSubscriptionMixin;
