import SocketActions from '../actions/SocketActions';
import SocketStore from '../stores/SocketStore.js';
import ApiSocket from '../utils/ApiSocket';

class SocketService {

  connect() {
    var socket = new ApiSocket();
    return socket.connect(false);
  }

  reconnect() {
    var socket = new ApiSocket();
    return socket.connect(true);
  }

  disconnect() {
    if (!SocketStore.socket) {
      console.log("Disconnect for a closed socket: " + path);
      return;
    }

    SocketStore.socket.disconnect();
  }

  put(path, data) {
    if (!SocketStore.socket) {
      console.log("PUT for a closed socket: " + path);
      return;
    }

    return SocketStore.socket.sendRequest(data, path, 'PUT');
  }

  post(path, data) {
    if (!SocketStore.socket) {
      console.log("POST for a closed socket: " + path);
      return;
    }

    return SocketStore.socket.sendRequest(data, path, 'POST');
  }

  delete(path, data) {
    if (!SocketStore.socket) {
      console.log("DELETE for a closed socket: " + path);
      return;
    }

    return SocketStore.socket.sendRequest(data, path, 'DELETE');
  }

  get(path, data) {
    if (!SocketStore.socket) {
      console.log("GET for a closed socket: " + path);
      return;
    }

    return SocketStore.socket.sendRequest(data, path, 'GET');
  }
}

export default new SocketService()
