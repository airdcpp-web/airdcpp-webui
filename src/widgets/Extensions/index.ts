import * as API from '@/types/api';
import * as UI from '@/types/ui';

import Extensions from './components/Extensions';

export const ExtensionWidgetInfo = {
  typeId: 'extensions',
  component: Extensions,
  name: 'Extension releases',
  nameKey: 'extensions',
  icon: 'green puzzle',
  access: API.AccessEnum.SETTINGS_VIEW,
  size: {
    w: 4,
    h: 5,
    minW: 2,
    minH: 3,
  },
} as UI.Widget;
