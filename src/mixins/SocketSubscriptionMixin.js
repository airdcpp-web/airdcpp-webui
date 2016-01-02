import SocketStore from 'stores/SocketStore';
import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';

// For React components
const SocketSubscriptionMixin = (updateCondition) => {
	let unsubscribe;

	return SocketSubscriptionDecorator({
		componentWillMount() {
			if (SocketStore.socket) {
				this.onSocketConnected(this.addSocketListener);
			}
		},

		componentDidUpdate(prevProps) {
			if (updateCondition && updateCondition.bind(this, prevProps)) {
				this.removeSocketListeners();
				this.onSocketConnected(this.addSocketListener);
			}
		},

		// Emulates the listenTo property that stores have
		addStoreListener(store, bind) {
			unsubscribe = store.listen(bind);
		},

		componentWillUnmount() {
			this.removeSocketListeners();
			unsubscribe();
		}
	}, null, 'addStoreListener');
};

export default SocketSubscriptionMixin;
