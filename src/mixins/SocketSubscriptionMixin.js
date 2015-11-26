import SocketStore from 'stores/SocketStore';
import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';

const SocketSubscriptionMixin = () => {
	return SocketSubscriptionDecorator({
		componentWillMount() {
			if (SocketStore.socket) {
				this.onSocketConnected(this.addSocketListener);
			}
		},

		addStoreListener(store, bind) {
			this.unsubscribe = store.listen(bind);
		},

		componentWillUnmount() {
			this.removeSocketListeners();
			this.unsubscribe();
		}
	}, 'addStoreListener');
};

export default SocketSubscriptionMixin;
