import { Socket } from 'airdcpp-apisocket';


const getLogLevel = () => {
  if (process.env.NODE_ENV !== 'production') {
    return 'verbose';
  }

  if (!!window.localStorage.getItem('debug')) {
    return 'verbose';
  }

  return 'info';
};

const options = {
  url: (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + getBasePath() + 'api/v1/',
  autoReconnect: false,
  reconnectInterval: 5,
  logLevel: getLogLevel(),
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