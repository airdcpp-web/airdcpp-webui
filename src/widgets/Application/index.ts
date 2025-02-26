import * as UI from '@/types/ui';

import ApplicationComponent from './components/Application';
import { SystemActionModule, SystemShutdownAction } from '@/actions/ui/system';

const SystemActionsMenu = {
  actions: {
    shutdown: SystemShutdownAction,
  },
  moduleData: SystemActionModule,
};

export const Application = {
  typeId: 'application',
  component: ApplicationComponent,
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
    actions: SystemActionsMenu,
  },
} as UI.Widget;
