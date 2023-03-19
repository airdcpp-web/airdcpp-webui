import * as UI from 'types/ui';

export const Extensions = {
  typeId: 'extensions',
  component: require('./components/Extensions').default,
  name: 'Extension releases',
  nameKey: 'extensions',
  icon: 'green puzzle',
  access: require('constants/AccessConstants').default.SETTINGS_VIEW,
  size: {
    w: 4,
    h: 5,
    minW: 2,
    minH: 3,
  },
} as UI.Widget;
