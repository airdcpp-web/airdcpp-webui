import ApiSocket from 'airdcpp-apisocket';


const options = {
  url: (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + getBasePath() + 'api/v1/',
  autoReconnect: false,
  reconnectInterval: 5,
  logLevel: 4,
  ignoredListenerEvents: [
    'transfer_statistics',
    'hash_statistics',
    'hub_counts_updated',
  ],
};

let Socket = ApiSocket(options, window.WebSocket);

export default Socket;