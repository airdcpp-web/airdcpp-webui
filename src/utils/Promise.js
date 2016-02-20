// Use native promises when available
let AppPromise;
if (window.Promise /*&& process.env.NODE_ENV !== 'production'*/) {
	AppPromise = window.Promise;
} else {
	AppPromise = require('promise');
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
