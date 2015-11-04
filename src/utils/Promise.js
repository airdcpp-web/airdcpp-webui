import Promise from 'bluebird';

function pending() {
	let resolve, reject;
	let promise = new Promise(function() {
		resolve = arguments[0];
		reject = arguments[1];
	});

	return {
		resolve: resolve,
		reject: reject,
		promise: promise
	};
}

export default Object.assign(Promise, {
	pending: pending
});
