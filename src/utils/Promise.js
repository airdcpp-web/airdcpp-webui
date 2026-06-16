function pending() {
  let resolve, reject;
  let promise = new Promise(function () {
    resolve = arguments[0];
    reject = arguments[1];
  });

  return {
    resolve,
    reject,
    promise,
  };
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default Object.assign(Promise, {
  pending,
});
