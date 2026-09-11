import IconConstants from '@/constants/IconConstants';

import { DOWNLOAD_SELECTION_ID } from '@/components/download/DownloadDialog';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

interface SelectableItemData {
  id: API.IdType;
}

// Sessions that items can be selected in. Filelists carry the user whose share
// is being browsed; search instances have no user.
interface SelectionEntity {
  user?: {
    flags: API.HubUserFlag[];
  };
}

// Nothing to download from your own share
const notSelf: UI.BulkActionFilter<SelectableItemData, any> = ({
  entity,
}: UI.FilterData<SelectableItemData[], SelectionEntity | undefined>) => {
  return !entity?.user?.flags.includes('self');
};

// Opens the regular download dialog for every selected item. The ids travel in
// the location state rather than the URL, as a selection can hold dozens of
// 39-character search result ids.
const handleBulkDownloadTo: UI.BulkActionHandler<SelectableItemData, any> = ({
  itemData: items,
  navigate,
}) => {
  navigate(`download/${DOWNLOAD_SELECTION_ID}`, {
    state: {
      downloadItemIds: items.map((item) => String(item.id)),
    },
  });
};

export const BulkDownloadToAction: UI.ActionDefinition<SelectableItemData, any> = {
  id: 'downloadTo',
  displayName: 'Download to...',
  access: API.AccessEnum.DOWNLOAD,
  icon: IconConstants.DOWNLOAD_TO,
  handler: () => {
    // Bulk-only action; the bulk handler below is always used
  },
  bulk: {
    enabled: true,
    filter: notSelf,
    handler: handleBulkDownloadTo,
  },
};

const SelectionActions: UI.ActionListType<SelectableItemData, any> = {
  downloadTo: BulkDownloadToAction,
};

export const SelectionActionModule = {
  moduleId: UI.Modules.COMMON,
};

export const SelectionActionMenu: UI.ModuleActions<SelectableItemData, any> = {
  moduleData: SelectionActionModule,
  actions: SelectionActions,
};
