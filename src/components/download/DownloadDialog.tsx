import * as React from 'react';
import { Location, Params, Route, Routes, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import {
  default as HistoryConstants,
  HistoryStringEnum,
} from '@/constants/HistoryConstants';
import FilesystemConstants from '@/constants/FilesystemConstants';
import IconConstants from '@/constants/IconConstants';

import NotificationActions from '@/actions/NotificationActions';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from '@/decorators/DataProviderDecorator';
import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from '@/decorators/ModalRouteDecorator';

import RouteModal, { RouteModalProps } from '@/components/semantic/RouteModal';
import { FileBrowserDialog } from '@/components/filebrowser';

import { runBackgroundSocketAction } from '@/utils/ActionUtils';
import { toI18nKey, translate } from '@/utils/TranslationUtils';
import { addHistory } from '@/services/api/HistoryApi';

import { DownloadLayout } from './layout';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { PathDownloadHandler } from './types';

import './style.css';
import { useSession } from '@/context/AppStoreContext';
import { useSocket } from '@/context/SocketContext';
import { getFileName, getFilePath, getParentPath } from '@/utils/FileUtils';
import { hasAccess } from '@/utils/AuthUtils';
import { useTableSelectionContextOptional } from '@/components/table/selection';

// Route parameter marking a download of the current table selection, whose ids
// travel in the location state rather than the URL (a selection can hold dozens
// of 39-character search result ids)
export const DOWNLOAD_SELECTION_ID = 'selection';

export interface DownloadSelectionLocationState {
  downloadItemIds: string[];
}

export const getDownloadItemIds = (
  params: Readonly<Params<string>>,
  location: Location,
): string[] => {
  const { downloadItemId } = params;
  if (downloadItemId !== DOWNLOAD_SELECTION_ID) {
    return !!downloadItemId ? [downloadItemId] : [];
  }

  const state = location.state as DownloadSelectionLocationState | null;
  return state?.downloadItemIds ?? [];
};

// Number of concurrent downloads. Each queued item is a separate hooked API
// request and the server runs those on a small shared task pool, so they are
// sent in modest batches instead of all at once.
const BATCH_SIZE = 5;

export type DownloadDialogProps<
  ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo,
> = UI.ItemDownloadHandler<ItemT, Props<ItemT>>;

type DownloadDialogRouteProps = ModalRouteDecoratorChildProps;

interface DownloadDialogDataProps<
  ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo,
> extends DataProviderDecoratorChildProps {
  historyPaths: string[];
  itemInfos: ItemT[];
}

type Props<ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo> =
  DownloadDialogProps<ItemT> & DownloadDialogDataProps<ItemT> & DownloadDialogRouteProps;

interface DownloadResult {
  item: UI.DownloadableItemInfo;
  error?: Error;
}

const DownloadDialog: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const session = useSession();
  const socket = useSocket();

  // Present when the dialog is rendered inside a selectable table, so a bulk
  // download can clear the selection it acted on
  const selection = useTableSelectionContextOptional();

  const {
    downloadHandler,
    itemInfos,
    userGetter,
    params,
    location,
    sessionItem,
    historyPaths,
    handleClose,
    ...other
  } = props;

  const itemCount = itemInfos.length;
  const isBulk = itemCount > 1;
  const firstItem = itemInfos[0];

  // The requested ids, in the same order as the items fetched from them.
  // userGetter is keyed by the requested id (chat registers download handlers
  // under it), so the item's own id can't be substituted here.
  const itemIds = getDownloadItemIds(params, location);

  const displayName = isBulk
    ? t(toI18nKey('downloadItemCount', UI.Modules.COMMON), {
        defaultValue: '{{count}} items',
        count: itemCount,
      })
    : firstItem?.name;

  const notifyResults = (results: DownloadResult[]) => {
    const failed = results.filter((result) => !!result.error);
    const succeeded = results.length - failed.length;

    if (!failed.length) {
      if (isBulk) {
        NotificationActions.success({
          title: translate('Download queued', t, UI.Modules.COMMON),
          message: t(toI18nKey('downloadQueuedCount', UI.Modules.COMMON), {
            defaultValue: '{{count}} items were added to the queue',
            count: succeeded,
          }),
        });
      }
      return;
    }

    // A single failure keeps the original per-item message
    if (failed.length === 1 && !isBulk) {
      NotificationActions.error({
        title: t(toI18nKey('queueingFailed', UI.Modules.COMMON), {
          defaultValue: 'Failed to queue the item {{item.name}}',
          replace: {
            item: failed[0].item,
          },
        }),
        message: failed[0].error!.message,
      });
      return;
    }

    if (!succeeded) {
      NotificationActions.error({
        title: translate('Download failed', t, UI.Modules.COMMON),
        message: t(toI18nKey('downloadFailedCount', UI.Modules.COMMON), {
          defaultValue: 'Failed to queue {{count}} items',
          count: failed.length,
        }),
      });
      return;
    }

    NotificationActions.warning({
      title: translate('Download partially completed', t, UI.Modules.COMMON),
      message: t(toI18nKey('downloadPartialCount', UI.Modules.COMMON), {
        defaultValue: '{{succeeded}} items queued, {{failed}} failed',
        succeeded,
        failed: failed.length,
      }),
    });
  };

  const handleDownload: PathDownloadHandler = async (targetPath, targetFilename) => {
    const results: DownloadResult[] = [];

    for (let i = 0; i < itemInfos.length; i += BATCH_SIZE) {
      const batch = itemInfos.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (itemInfo, batchIndex): Promise<DownloadResult> => {
          try {
            const itemData = {
              itemInfo,
              user: !!userGetter ? userGetter(itemIds[i + batchIndex], props) : undefined,
              entity: sessionItem,
            };

            const downloadData = {
              // A rename from the file browser only applies to a single item
              target_name:
                !isBulk && !!targetFilename ? targetFilename : itemInfo.name,
              target_directory: targetPath,
              priority: API.QueuePriorityEnum.DEFAULT,
            };

            await downloadHandler(itemData, downloadData, socket);
            return { item: itemInfo };
          } catch (e) {
            return { item: itemInfo, error: e as Error };
          }
        }),
      );

      results.push(...batchResults);
    }

    notifyResults(results);

    // Clear the selection that was acted on, but only if something was queued
    if (isBulk && results.some((result) => !result.error)) {
      selection?.clearSelection();
    }

    runBackgroundSocketAction(
      () => addHistory(socket, HistoryStringEnum.DOWNLOAD_DIR, targetPath),
      t,
    );
  };

  const getInitialBrowsePath = () => {
    const path = historyPaths.length > 0 ? historyPaths[historyPaths.length - 1] : '';
    if (isBulk || !firstItem || firstItem.type.id === 'directory') {
      return path;
    }

    return path + firstItem.name;
  };

  const handleBrowse = () => {
    navigate(`browse`);
  };

  // Suggested targets come from wherever the selected items already exist
  const dupePaths = React.useMemo(() => {
    const paths = new Set<string>();
    itemInfos.forEach((itemInfo) => {
      itemInfo.dupe?.paths.forEach((path) => paths.add(getParentPath(path)));
    });
    return Array.from(paths);
  }, [itemInfos]);

  const commonDialogProps: RouteModalProps = {
    subHeader: displayName,
    title: translate('Download', t, UI.Modules.COMMON),
    icon: IconConstants.DOWNLOAD,
    closable: false,
  };

  if (!itemCount) {
    // The selection was lost, e.g. by opening the route directly
    return (
      <RouteModal
        className="download-dialog"
        {...commonDialogProps}
        closable={true}
        subHeader={undefined}
        {...other}
      >
        <div className="ui message warning">
          {translate('No items were selected for downloading', t, UI.Modules.COMMON)}
        </div>
      </RouteModal>
    );
  }

  const hasFileBrowserAccess = hasAccess(session, API.AccessEnum.FILESYSTEM_VIEW);
  return (
    <Routes>
      <Route
        path="browse/*"
        element={
          <FileBrowserDialog
            onConfirm={async (path) => {
              await handleDownload(getFilePath(path), getFileName(path));
            }}
            initialPath={getInitialBrowsePath()}
            selectMode={
              isBulk || firstItem.type.id === 'directory'
                ? UI.FileSelectModeEnum.DIRECTORY
                : UI.FileSelectModeEnum.FILE
            }
            historyId={FilesystemConstants.LOCATION_DOWNLOAD}
            approveCaption={translate('Download', t, UI.Modules.COMMON)}
            modalComponent={RouteModal}
            {...commonDialogProps}
          />
        }
      />
      <Route
        index
        element={
          <RouteModal
            className="download-dialog"
            fullHeight={true}
            {...commonDialogProps}
            {...other}
          >
            <DownloadLayout
              downloadHandler={async (targetPath, targetFilename) => {
                await handleDownload(targetPath, targetFilename);
                await handleClose();
              }}
              handleBrowse={hasFileBrowserAccess ? handleBrowse : undefined}
              historyPaths={historyPaths}
              dupePaths={dupePaths}
            />
          </RouteModal>
        }
      />
    </Routes>
  );
};

export default ModalRouteDecorator<DownloadDialogProps>(
  DataProviderDecorator<
    DownloadDialogProps & DownloadDialogRouteProps,
    DownloadDialogDataProps
  >(DownloadDialog, {
    urls: {
      historyPaths: `${HistoryConstants.STRINGS_URL}/${HistoryStringEnum.DOWNLOAD_DIR}`,
      itemInfos: ({ params, location, itemDataGetter }, socket) => {
        const ids = getDownloadItemIds(params, location);
        return Promise.all(ids.map((id) => itemDataGetter(id, socket)));
      },
    },
  }),
  '/download/:downloadItemId',
);
