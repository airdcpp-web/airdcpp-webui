import SocketStore from 'stores/SocketStore';
import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';

// For React components
const SocketSubscriptionMixin = () => {
	return SocketSubscriptionDecorator({
		componentWillMount() {
			if (SocketStore.socket) {
				this.onSocketConnected(this.addSocketListener);
			}
		},

		// Emulates the listenTo property that stores have
		addStoreListener(store, bind) {
			this.unsubscribe = store.listen(bind);
		},

		componentWillUnmount() {
			this.removeSocketListeners();
			this.unsubscribe();
		}
	}, null, 'addStoreListener');
};

export default SocketSubscriptionMixin;
