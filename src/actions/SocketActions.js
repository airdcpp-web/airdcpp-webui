import Reflux from 'reflux';

// Triggered by API socket
export default Reflux.createActions([
  { "state": {children: ["disconnected", "connecting", "connected"]} },
  "message"
]);