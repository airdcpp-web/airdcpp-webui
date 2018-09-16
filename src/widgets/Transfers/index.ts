import * as UI from 'types/ui';

module.exports = {
  typeId: 'transfers',
  component: require('./components/Transfers').default,
  access: require('constants/AccessConstants').default.TRANSFERS,
  name: 'Transfers',
  icon: 'exchange',
  size: {
    w: 5,
    h: 5,
    minW: 2,
    minH: 5,
  },
  actionMenu: {
    actions: require('actions/QueueActions').default,
    ids: [ 'resume', 'pause' ],
  },
} as UI.Widget;

