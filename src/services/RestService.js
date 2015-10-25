import LoginStore from 'stores/LoginStore';

var request = require('superagent');

var API_URL = '/api/';
var TIMEOUT = 10000;

function makeUrl(url) {
	return API_URL + url;
}

// a get request with an authtoken param
export function get(url) {
	return request
			.get(makeUrl(url))
			.timeout(TIMEOUT)
			.set('Authorization', LoginStore.token);
}

export function post(url) {
	return request
			.post(makeUrl(url))
			.timeout(TIMEOUT)
			.set('Authorization', LoginStore.token);
}

export function del(url) {
	return request
			.del(makeUrl(url))
			.timeout(TIMEOUT)
			.set('Authorization', LoginStore.token);
}

export function put(url) {
	return request
			.put(makeUrl(url))
			.timeout(TIMEOUT)
			.set('Authorization', LoginStore.token);
}
