import ApiSocket from 'airdcpp-apisocket/dist/SocketBase';


const options = {
	url: window.location.host,
	secure: window.location.protocol === 'https:',
	autoReconnect: false,
	userSession: true,
	logLevel: 4,
	ignoredConsoleEvents: [
		'transfer_statistics',
		'hash_statistics',
		'hub_counts_updated',
	],
};

let Socket = ApiSocket(options, WebSocket);

export default Socket;