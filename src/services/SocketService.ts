import ApiSocket from 'airdcpp-apisocket';


const options = {
  url: (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + getBasePath() + 'api/v1/',
  autoReconnect: false,
  reconnectInterval: 5,
  logLevel: 'info',
  ignoredListenerEvents: [
    'transfer_statistics',
    'hash_statistics',
    'hub_counts_updated',
  ],
};

const Socket = ApiSocket(options, WebSocket as any);

type SocketType = typeof ApiSocket;

export { SocketType as APISocket };

export default Socket;