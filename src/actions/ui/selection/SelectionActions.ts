import IconConstants from '@/constants/IconConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

// Bulk download action - triggers dialog via onActionClick callback
export const BulkDownloadAction: UI.ActionDefinition<any, any> = {
  id: 'download',
  displayName: 'Download',
  access: API.AccessEnum.DOWNLOAD,
  icon: IconConstants.DOWNLOAD,
  handler: () => {
    // Handler is intentionally empty - action is intercepted by onActionClick
    // which opens BulkDownloadDialog
  },
  bulk: {
    enabled: true,
  },
};

// Bulk download to specific location
export const BulkDownloadToAction: UI.ActionDefinition<any, any> = {
  id: 'downloadTo',
  displayName: 'Download to...',
  access: API.AccessEnum.DOWNLOAD,
  icon: IconConstants.DOWNLOAD_TO,
  handler: () => {
    // Handler is intentionally empty - action is intercepted by onActionClick
    // which opens BulkDownloadDialog
  },
  bulk: {
    enabled: true,
  },
};

const SelectionActions: UI.ActionListType<any, any> = {
  download: BulkDownloadAction,
  downloadTo: BulkDownloadToAction,
};

export const SelectionActionModule = {
  moduleId: UI.Modules.COMMON,
};

export const SelectionActionMenu: UI.ModuleActions<any, any> = {
  moduleData: SelectionActionModule,
  actions: SelectionActions,
};
