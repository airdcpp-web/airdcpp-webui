import SocketService from 'services/SocketService';
import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';

// For React components
const SocketSubscriptionMixin = (sessionStore) => {
  const removeSocketSubscriptions = (props, removeSocketListeners) => {
    let entityExists = true;
    if (sessionStore) {
      entityExists = !!sessionStore.getSession(props.session.id);
    }

    removeSocketListeners(entityExists);
  };

  return SocketSubscriptionDecorator({
    componentWillMount() {
      if (SocketService.isConnected()) {
        this.onSocketConnected(this.addSocketListener);
      }
    },

    componentDidUpdate(prevProps) {
      if (!sessionStore) {
        return;
      }

      if (this.props.session.id !== prevProps.session.id) {
        removeSocketSubscriptions(prevProps, this.removeSocketListeners);
        this.onSocketConnected(this.addSocketListener);
      }
    },

    componentWillUnmount() {
      removeSocketSubscriptions(this.props, this.removeSocketListeners);
    }
  });
};

export default SocketSubscriptionMixin;
