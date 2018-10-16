import { Socket } from 'airdcpp-apisocket';


const options = {
  url: (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + getBasePath() + 'api/v1/',
  autoReconnect: false,
  reconnectInterval: 5,
  logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'verbose',
  ignoredListenerEvents: [
    'transfer_statistics',
    'hash_statistics',
    'hub_counts_updated',
  ],
};

const APISocket = Socket(options, WebSocket as any);

type SocketType = typeof APISocket;

export { SocketType as APISocket };

export default APISocket;