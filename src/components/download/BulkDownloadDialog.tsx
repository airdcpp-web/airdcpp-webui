import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Modal, { ModalHandle } from '@/components/semantic/Modal';
import { DownloadLayout } from './layout';
import NotificationActions from '@/actions/NotificationActions';

import IconConstants from '@/constants/IconConstants';
import { toI18nKey, translate } from '@/utils/TranslationUtils';
import { runBackgroundSocketAction } from '@/utils/ActionUtils';
import { addHistory } from '@/services/api/HistoryApi';
import HistoryConstants, { HistoryStringEnum } from '@/constants/HistoryConstants';

import { useSocket } from '@/context/SocketContext';
import { BulkSelectionData, BulkDownloadResult } from '@/components/table/selection/types';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

export interface BulkDownloadItem extends UI.DownloadableItemInfo {
  // Item must have id, name, type, tth, size, path, dupe, time
}

// Props for item-based bulk download (legacy mode)
interface ItemBasedProps<ItemT extends BulkDownloadItem> {
  // Items to download
  items: ItemT[];
  // Download handler for individual items
  downloadHandler: UI.DownloadHandler<ItemT>;
  // Function to get user for an item (for filelist downloads)
  userGetter?: (item: ItemT) => UI.DownloadSource | undefined;
  // Bulk API mode props should not be set
  selectionData?: never;
  bulkApiUrl?: never;
}

// Props for selection-based bulk download (new API mode)
interface SelectionBasedProps {
  // Selection data with IDs for backend resolution
  selectionData: BulkSelectionData;
  // API URL for bulk download (e.g., '/search/1/results/download' or '/filelists/CID/items/download')
  bulkApiUrl: string;
  // Item-based props should not be set
  items?: never;
  downloadHandler?: never;
  userGetter?: never;
}

type BulkDownloadModeProps<ItemT extends BulkDownloadItem> =
  | ItemBasedProps<ItemT>
  | SelectionBasedProps;

export type BulkDownloadDialogProps<ItemT extends BulkDownloadItem> =
  BulkDownloadModeProps<ItemT> & {
    // Session item (search instance or filelist session)
    sessionItem: UI.SessionItemBase | undefined;
    // Called when dialog closes (after downloads complete or cancelled)
    onClose: () => void;
    // History paths for initial suggestions
    historyPaths?: string[];
    // Display name for the bulk operation (defaults to "X items")
    displayName?: string;
  };

interface DownloadResult {
  item: BulkDownloadItem;
  success: boolean;
  error?: string;
}

// Number of concurrent downloads per batch. Balances parallelism with
// server load and browser connection limits. Higher values may cause
// rate limiting or connection exhaustion.
const BATCH_SIZE = 5;

// Helper to check if we're in selection-based mode
const isSelectionMode = <ItemT extends BulkDownloadItem>(
  props: BulkDownloadDialogProps<ItemT>,
): props is SelectionBasedProps & {
  sessionItem: UI.SessionItemBase | undefined;
  onClose: () => void;
  historyPaths?: string[];
  displayName?: string;
} => {
  return 'selectionData' in props && props.selectionData !== undefined;
};

const BulkDownloadDialog = <ItemT extends BulkDownloadItem>(
  props: BulkDownloadDialogProps<ItemT>,
) => {
  const { sessionItem, onClose, historyPaths: propHistoryPaths, displayName } = props;
  const { t } = useTranslation();
  const socket = useSocket();
  const modalRef = useRef<ModalHandle>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [fetchedHistoryPaths, setFetchedHistoryPaths] = useState<string[]>([]);

  // Fetch history paths if not provided via props
  useEffect(() => {
    if (!propHistoryPaths) {
      socket
        .get<string[]>(`${HistoryConstants.STRINGS_URL}/${HistoryStringEnum.DOWNLOAD_DIR}`)
        .then(setFetchedHistoryPaths)
        .catch(() => {
          // Ignore errors - history is optional
        });
    }
  }, [propHistoryPaths, socket]);

  const historyPaths = propHistoryPaths ?? fetchedHistoryPaths;

  // Determine the count and display name based on mode
  const getItemCount = (): number => {
    if (!isSelectionMode(props)) {
      return props.items.length;
    }
    if (props.selectionData.mode === 'select_all') {
      return props.selectionData.totalCount - props.selectionData.excludedIds.length;
    }
    return props.selectionData.selectedIds.length;
  };
  const itemCount = getItemCount();

  const effectiveDisplayName =
    displayName ||
    t(toI18nKey('bulkDownloadItems', UI.Modules.COMMON), {
      defaultValue: '{{count}} items',
      count: itemCount,
    });

  // Handle empty selection - close dialog immediately
  useEffect(() => {
    if (itemCount === 0) {
      onClose();
    }
  }, [itemCount, onClose]);

  if (itemCount === 0) {
    return null;
  }

  // Show notification based on results
  const showResultNotification = (succeeded: number, failed: number) => {
    if (failed === 0) {
      NotificationActions.success({
        title: t(toI18nKey('bulkDownloadComplete', UI.Modules.COMMON), {
          defaultValue: 'Download queued',
        }),
        message: t(toI18nKey('bulkDownloadSuccessMessage', UI.Modules.COMMON), {
          defaultValue: '{{count}} items added to queue',
          count: succeeded,
        }),
      });
    } else if (succeeded === 0) {
      NotificationActions.error({
        title: t(toI18nKey('bulkDownloadFailed', UI.Modules.COMMON), {
          defaultValue: 'Download failed',
        }),
        message: t(toI18nKey('bulkDownloadFailMessage', UI.Modules.COMMON), {
          defaultValue: 'Failed to queue {{count}} items',
          count: failed,
        }),
      });
    } else {
      NotificationActions.warning({
        title: t(toI18nKey('bulkDownloadPartial', UI.Modules.COMMON), {
          defaultValue: 'Download partially completed',
        }),
        message: t(toI18nKey('bulkDownloadPartialMessage', UI.Modules.COMMON), {
          defaultValue: '{{succeeded}} items queued, {{failed}} failed',
          succeeded,
          failed,
        }),
      });
    }
  };

  // Handle download using new bulk API
  const handleBulkApiDownload = async (targetPath: string) => {
    if (!isSelectionMode(props)) return;

    setIsDownloading(true);

    try {
      const { selectionData, bulkApiUrl } = props;

      // Build request body based on selection mode
      const requestBody: Record<string, unknown> = {
        target_directory: targetPath,
        priority: API.PriorityEnum.NORMAL,
      };

      if (selectionData.mode === 'select_all') {
        // For select-all, send excluded IDs
        requestBody.select_all = true;
        requestBody.excluded_ids = selectionData.excludedIds;
      } else if (bulkApiUrl.includes('/results/')) {
        // Search results use TTHs
        requestBody.tths = selectionData.selectedIds;
      } else {
        // Filelist items use item_ids
        requestBody.item_ids = selectionData.selectedIds;
      }

      const result = await socket.post<BulkDownloadResult>(bulkApiUrl, requestBody);

      showResultNotification(result.succeeded.length, result.failed.length);
    } catch (error: any) {
      NotificationActions.error({
        title: t(toI18nKey('bulkDownloadFailed', UI.Modules.COMMON), {
          defaultValue: 'Download failed',
        }),
        message: error?.message || 'Unknown error',
      });
    }

    // Save to history
    runBackgroundSocketAction(
      () => addHistory(socket, HistoryStringEnum.DOWNLOAD_DIR, targetPath),
      t,
    );

    setIsDownloading(false);
    modalRef.current?.hide();
    onClose();
  };

  // Handle download using item-by-item approach (legacy mode)
  const handleItemBasedDownload = async (targetPath: string) => {
    if (isSelectionMode(props)) return;

    const { items, downloadHandler, userGetter } = props;

    setIsDownloading(true);

    const results: DownloadResult[] = [];

    // Process downloads in parallel batches for better performance
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (item): Promise<DownloadResult> => {
          try {
            const itemData = {
              itemInfo: item,
              user: userGetter ? userGetter(item) : undefined,
              entity: sessionItem,
            };

            const downloadData: API.DownloadData = {
              target_name: item.name,
              target_directory: targetPath,
              priority: API.PriorityEnum.NORMAL,
            };

            await downloadHandler(itemData, downloadData, socket);
            return { item, success: true };
          } catch (error: any) {
            const errorMessage = error?.message || 'Unknown error';
            console.error(`Failed to queue download for "${item.name}":`, errorMessage);
            return {
              item,
              success: false,
              error: errorMessage,
            };
          }
        }),
      );
      results.push(...batchResults);
    }

    // Save to history
    runBackgroundSocketAction(
      () => addHistory(socket, HistoryStringEnum.DOWNLOAD_DIR, targetPath),
      t,
    );

    const succeeded = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    showResultNotification(succeeded, failed);

    setIsDownloading(false);
    modalRef.current?.hide();
    onClose();
  };

  const handleDownload = isSelectionMode(props)
    ? handleBulkApiDownload
    : handleItemBasedDownload;

  // Create a synthetic item info for the dialog header
  // For selection mode, we create a minimal display item
  const displayInfo: UI.DownloadableItemInfo = isSelectionMode(props)
    ? {
        id: 0,
        name: effectiveDisplayName,
        type: { id: 'directory', str: 'Directory', files: itemCount, directories: 0 },
        tth: '',
        size: -1,
        path: '',
        dupe: null,
        time: 0,
      }
    : {
        ...props.items[0],
        name: effectiveDisplayName,
      };

  return (
    <Modal
      ref={modalRef}
      className="bulk-download-dialog"
      fullHeight={true}
      closable={!isDownloading}
      title={translate('Download', t, UI.Modules.COMMON)}
      subHeader={displayInfo.name}
      icon={IconConstants.DOWNLOAD}
      onReject={onClose}
    >
      <DownloadLayout
        downloadHandler={handleDownload}
        handleBrowse={undefined}
        historyPaths={historyPaths}
        itemInfo={displayInfo}
      />
    </Modal>
  );
};

export default BulkDownloadDialog;
