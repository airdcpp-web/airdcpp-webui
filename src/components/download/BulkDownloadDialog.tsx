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
import { HistoryStringEnum } from '@/constants/HistoryConstants';

import { useSocket } from '@/context/SocketContext';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

export interface BulkDownloadItem extends UI.DownloadableItemInfo {
  // Item must have id, name, type, tth, size, path, dupe, time
}

export interface BulkDownloadDialogProps<ItemT extends BulkDownloadItem> {
  // Items to download
  items: ItemT[];
  // Download handler for individual items
  downloadHandler: UI.DownloadHandler<ItemT>;
  // Session item (search instance or filelist session)
  sessionItem: UI.SessionItemBase | undefined;
  // Function to get user for an item (for filelist downloads)
  userGetter?: (item: ItemT) => UI.DownloadSource | undefined;
  // Called when dialog closes (after downloads complete or cancelled)
  onClose: () => void;
  // History paths for initial suggestions
  historyPaths?: string[];
}

interface DownloadResult {
  item: BulkDownloadItem;
  success: boolean;
  error?: string;
}

// Number of concurrent downloads per batch. Balances parallelism with
// server load and browser connection limits. Higher values may cause
// rate limiting or connection exhaustion.
const BATCH_SIZE = 5;

const BulkDownloadDialog = <ItemT extends BulkDownloadItem>({
  items,
  downloadHandler,
  sessionItem,
  userGetter,
  onClose,
  historyPaths = [],
}: BulkDownloadDialogProps<ItemT>) => {
  const { t } = useTranslation();
  const socket = useSocket();
  const modalRef = useRef<ModalHandle>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Reference item for dialog display (all items go to same directory,
  // so we use the first item's properties for the UI)
  const referenceItem = items[0];

  // Handle empty items array - close dialog immediately
  useEffect(() => {
    if (!referenceItem) {
      onClose();
    }
  }, [referenceItem, onClose]);

  if (!referenceItem) {
    return null;
  }

  const handleDownload = async (targetPath: string) => {
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
        })
      );
      results.push(...batchResults);
    }

    // Save to history
    runBackgroundSocketAction(
      () => addHistory(socket, HistoryStringEnum.DOWNLOAD_DIR, targetPath),
      t
    );

    // Show results notification
    const succeeded = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

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

    setIsDownloading(false);
    modalRef.current?.hide();
    onClose();
  };

  // Create a synthetic item info for the dialog header
  const displayInfo: UI.DownloadableItemInfo = {
    ...referenceItem,
    name: t(toI18nKey('bulkDownloadItems', UI.Modules.COMMON), {
      defaultValue: '{{count}} items',
      count: items.length,
    }),
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
