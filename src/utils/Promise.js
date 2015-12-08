// Use native promises when available (bluebird causes delays with table scrolling)
let AppPromise;
if (window.Promise /*&& process.env.NODE_ENV !== 'production'*/) {
	AppPromise = window.Promise;
} else {
	AppPromise = require('bluebird');
}

function pending() {
	let resolve, reject;
	let promise = new AppPromise(function () {
		resolve = arguments[0];
		reject = arguments[1];
	});

	return {
		resolve,
		reject,
		promise
	};
}

export default Object.assign(AppPromise, {
	pending
});
