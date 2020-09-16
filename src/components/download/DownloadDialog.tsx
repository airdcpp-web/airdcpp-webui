//import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';
import { useTranslation } from 'react-i18next';

import ShareConstants from 'constants/ShareConstants';
import { default as HistoryConstants, HistoryStringEnum } from 'constants/HistoryConstants';
import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';
import FilesystemConstants from 'constants/FilesystemConstants';
import IconConstants from 'constants/IconConstants';

import NotificationActions from 'actions/NotificationActions';
import LoginStore from 'stores/LoginStore';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';

import Modal, { ModalProps } from 'components/semantic/Modal';
import { FileBrowserDialog } from 'components/filebrowser';

import { runBackgroundSocketAction } from 'utils/ActionUtils';
import { toI18nKey, translate } from 'utils/TranslationUtils';
import { addHistory } from 'services/api/HistoryApi';

import { DownloadLayout, DownloadDataProps } from './layout';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { PathDownloadHandler } from './types';

import './style.css';


type DownloadItemIdType = string;

export type DownloadDialogProps<ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo> = 
  UI.ItemDownloadHandler<ItemT, Props<ItemT>>;

interface RouteProps { 
  downloadItemId: DownloadItemIdType; 
}

type DownloadDialogRouteProps = ModalRouteDecoratorChildProps<RouteProps>;

interface DownloadDialogDataProps<ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo> 
  extends DataProviderDecoratorChildProps, DownloadDataProps<ItemT> {


}


type Props<ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo> = DownloadDialogProps<ItemT> & 
  DownloadDialogDataProps<ItemT> & 
  DownloadDialogRouteProps;


const DownloadDialog: React.FC<Props> = props => {
  const { t } = useTranslation();
  const modalRef = useRef<Modal>(null);

  const { 
    downloadHandler, itemInfo, userGetter, match, 
    session, historyPaths, favoritePaths, sharePaths, 
    ...other 
  } = props;

  const handleDownload: PathDownloadHandler = async (targetPath, targetFilename) => {
    try {
      await downloadHandler(
        itemInfo, 
        !!userGetter ? userGetter(match.params.downloadItemId, props) : undefined, 
        {
          target_name: !!targetFilename ? targetFilename : itemInfo.name,
          target_directory: targetPath,
          priority: API.QueuePriorityEnum.DEFAULT,
        },
        session
      );
    } catch (e) {
      NotificationActions.error({
        title: t(
          toI18nKey('queueingFailed', UI.Modules.COMMON),
          {
            defaultValue: 'Failed to queue the item {{item.name}}',
            replace: {
              item: itemInfo
            }
          }
        ),
        message: e.message
      });
    }

    runBackgroundSocketAction(
      () => addHistory(HistoryStringEnum.DOWNLOAD_DIR, targetPath),
      t
    );

    if (!!modalRef.current) {
      modalRef.current.hide();
    }
  };

  const getInitialBrowsePath = () => {
    const path = historyPaths.length > 0 ? historyPaths[historyPaths.length - 1] : '';
    return itemInfo.type.id === 'directory' ? path : path + itemInfo.name;
  };

  const handleBrowse = () => {
    const { history } = props;
    history.replace(`${match.url}/browse`);
  };

  const commonDialogProps: ModalProps = {
    subHeader: itemInfo.name,
    title: translate('Download', t, UI.Modules.COMMON),
    icon: IconConstants.DOWNLOAD,
    closable: false,
    returnTo: props.returnTo,
  };

  const hasFileBrowserAccess = LoginStore.hasAccess(API.AccessEnum.FILESYSTEM_VIEW);
  return (
    <Switch>
      <Route path={ `${match.path}/browse` }>
        <FileBrowserDialog
          onConfirm={ (path, directoryPath, fileName) => handleDownload(directoryPath, fileName) }
          initialPath={ getInitialBrowsePath() }
          selectMode={ 
            itemInfo.type.id === 'directory' ? UI.FileSelectModeEnum.DIRECTORY : UI.FileSelectModeEnum.FILE 
          }
          historyId={ FilesystemConstants.LOCATION_DOWNLOAD }
          approveCaption={ translate('Download', t, UI.Modules.COMMON) }
          { ...commonDialogProps }
        />
      </Route>
      <Route path={ match.path } exact>
        <Modal 
          ref={ modalRef }
          className="download-dialog" 
          fullHeight={ true }
          { ...commonDialogProps }
          { ...other }
        >
          <DownloadLayout
            downloadHandler={ handleDownload }
            handleBrowse={ hasFileBrowserAccess ? handleBrowse : undefined }
            historyPaths={ historyPaths }
            favoritePaths={ favoritePaths }
            sharePaths={ sharePaths }
            itemInfo={ itemInfo }
          />
        </Modal>
      </Route>
    </Switch>
  );
};

export default ModalRouteDecorator<DownloadDialogProps, RouteProps>(
  DataProviderDecorator<DownloadDialogProps & DownloadDialogRouteProps, DownloadDialogDataProps>(
    DownloadDialog, 
    {
      urls: {
        sharePaths: ShareConstants.GROUPED_ROOTS_GET_URL,
        favoritePaths: FavoriteDirectoryConstants.GROUPED_DIRECTORIES_URL,
        historyPaths: HistoryConstants.STRINGS_URL + '/' + HistoryStringEnum.DOWNLOAD_DIR,
        itemInfo: ({ match, itemDataGetter }, socket) => {
          return itemDataGetter(match.params.downloadItemId, socket);
        }
      },
    }
  ),
  'download/:downloadItemId'
);