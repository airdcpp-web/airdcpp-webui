import AccessConstants from 'constants/AccessConstants';
import { QueueActionMenu } from 'actions/ui/queue';

import * as UI from 'types/ui';

import TransfersComponent from './components/Transfers';

export const Transfers = {
  typeId: 'transfers',
  component: TransfersComponent,
  access: AccessConstants.TRANSFERS,
  name: 'Transfers',
  icon: 'exchange',
  size: {
    w: 5,
    h: 5,
    minW: 2,
    minH: 5,
  },
  actionMenu: {
    actions: QueueActionMenu,
    ids: ['resume', 'pause'],
  },
} as UI.Widget;
