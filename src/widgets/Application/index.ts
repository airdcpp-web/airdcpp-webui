import * as UI from 'types/ui';

export const Application = {
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
    actions: require('actions/ui/SystemActions').default,
    ids: [ 'shutdown' ],
  },
} as UI.Widget;

