module.exports = {
  path: 'transfers',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Transfers').default);
    }, 'transfers');
  }
};

