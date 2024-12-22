import * as React from 'react';
import { Route, Routes, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import {
  default as HistoryConstants,
  HistoryStringEnum,
} from 'constants/HistoryConstants';
import FilesystemConstants from 'constants/FilesystemConstants';
import IconConstants from 'constants/IconConstants';

import NotificationActions from 'actions/NotificationActions';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';
import ModalRouteDecorator, {
  ModalRouteDecoratorChildProps,
} from 'decorators/ModalRouteDecorator';

import RouteModal, { RouteModalProps } from 'components/semantic/RouteModal';
import { FileBrowserDialog } from 'components/filebrowser';

import { runBackgroundSocketAction } from 'utils/ActionUtils';
import { toI18nKey, translate } from 'utils/TranslationUtils';
import { addHistory } from 'services/api/HistoryApi';

import { DownloadLayout } from './layout';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { PathDownloadHandler } from './types';

import './style.css';
import { useSession } from 'context/SessionContext';
import { useSocket } from 'context/SocketContext';

export type DownloadDialogProps<
  ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo,
> = UI.ItemDownloadHandler<ItemT, Props<ItemT>>;

type DownloadDialogRouteProps = ModalRouteDecoratorChildProps;

interface DownloadDialogDataProps<
  ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo,
> extends DataProviderDecoratorChildProps {
  historyPaths: string[];
  itemInfo: ItemT;
}

type Props<ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo> =
  DownloadDialogProps<ItemT> & DownloadDialogDataProps<ItemT> & DownloadDialogRouteProps;

const DownloadDialog: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasAccess } = useSession();
  const socket = useSocket();

  const {
    downloadHandler,
    itemInfo,
    userGetter,
    params,
    session,
    historyPaths,
    handleClose,
    ...other
  } = props;

  const handleDownload: PathDownloadHandler = async (targetPath, targetFilename) => {
    try {
      await downloadHandler(
        itemInfo,
        !!userGetter ? userGetter(params.downloadItemId!, props) : undefined,
        {
          target_name: !!targetFilename ? targetFilename : itemInfo.name,
          target_directory: targetPath,
          priority: API.QueuePriorityEnum.DEFAULT,
        },
        session,
      );
    } catch (e) {
      NotificationActions.error({
        title: t(toI18nKey('queueingFailed', UI.Modules.COMMON), {
          defaultValue: 'Failed to queue the item {{item.name}}',
          replace: {
            item: itemInfo,
          },
        }),
        message: e.message,
      });
    }

    runBackgroundSocketAction(
      () => addHistory(socket, HistoryStringEnum.DOWNLOAD_DIR, targetPath),
      t,
    );
  };

  const getInitialBrowsePath = () => {
    const path = historyPaths.length > 0 ? historyPaths[historyPaths.length - 1] : '';
    return itemInfo.type.id === 'directory' ? path : path + itemInfo.name;
  };

  const handleBrowse = () => {
    navigate(`browse`);
  };

  const commonDialogProps: RouteModalProps = {
    subHeader: itemInfo.name,
    title: translate('Download', t, UI.Modules.COMMON),
    icon: IconConstants.DOWNLOAD,
    closable: false,
  };

  const hasFileBrowserAccess = hasAccess(API.AccessEnum.FILESYSTEM_VIEW);
  return (
    <Routes>
      <Route
        path="browse/*"
        element={
          <FileBrowserDialog
            onConfirm={(path, directoryPath, fileName) =>
              handleDownload(directoryPath, fileName)
            }
            initialPath={getInitialBrowsePath()}
            selectMode={
              itemInfo.type.id === 'directory'
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
              itemInfo={itemInfo}
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
      itemInfo: ({ params, itemDataGetter }, socket) => {
        return itemDataGetter(params.downloadItemId!, socket);
      },
    },
  }),
  '/download/:downloadItemId',
);
