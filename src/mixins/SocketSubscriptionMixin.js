import SocketStore from 'stores/SocketStore';
import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';

const Mixin = {
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
};

export default SocketSubscriptionDecorator(Mixin, 'addStoreListener');
