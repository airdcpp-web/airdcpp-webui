module.exports = {
  typeId: 'application',
  component: require('./components/Application').default,
  name: 'Application',
  icon: 'blue info',
  alwaysShow: true,
  size: {
    w: 2,
    h: 5,
    minW: 2,
    minH: 4,
  },
  actionMenu: {
    actions: require('actions/SystemActions').default,
    ids: [ 'shutdown' ],
  },
};

