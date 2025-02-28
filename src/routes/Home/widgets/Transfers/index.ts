import { QueueActionMenu } from '@/actions/ui/queue';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import TransfersComponent from './components/Transfers';

export const TransferWidgetInfo = {
  typeId: 'transfers',
  component: TransfersComponent,
  access: API.AccessEnum.TRANSFERS,
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
