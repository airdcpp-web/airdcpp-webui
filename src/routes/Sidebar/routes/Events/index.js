module.exports = {
  path: '/events',
	
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/SystemLog').default);
    }, 'events');
  }
};

