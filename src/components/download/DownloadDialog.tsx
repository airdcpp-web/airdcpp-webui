//import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';

import ShareConstants from 'constants/ShareConstants';
import { default as HistoryConstants, HistoryStringEnum } from 'constants/HistoryConstants';
import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';
import IconConstants from 'constants/IconConstants';

import { getParentPath } from 'utils/FileUtils';
import { useMobileLayout } from 'utils/BrowserUtils';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';

import Dropdown from 'components/semantic/Dropdown';
import MenuItemLink from 'components/semantic/MenuItemLink';
import Modal from 'components/semantic/Modal';

import * as API from 'types/api';
import * as UI from 'types/ui';

import './style.css';

import { APISocket } from 'airdcpp-apisocket';

import i18next from 'i18next';
import { toI18nKey, translate } from 'utils/TranslationUtils';
import { useTranslation } from 'react-i18next';
import { getDownloadSections, DownloadSection } from './sections';
import { addHistory } from 'services/api/HistoryApi';
import { runBackgroundSocketAction } from 'utils/ActionUtils';
import NotificationActions from 'actions/NotificationActions';
import { Grid } from 'components/semantic/Grid';


interface LayoutProps {
  menuItems: React.ReactNode[];
  title: string;
}

const NormalLayout: React.FC<LayoutProps> = ({ menuItems, title, children }) => (
  <Grid className="normal layout">
    <div className="four wide column">
      <div className="ui vertical fluid tabular menu">
        { menuItems }
      </div>
    </div>
    <div className="twelve wide stretched column">
      <div className="ui segment main-content">
        { children }
      </div>
    </div>
  </Grid>
);

const MobileLayout: React.FC<LayoutProps> = ({ menuItems, title, children }) => (
  <div className="mobile layout">
    <Dropdown  
      selection={ true }
      caption={ title }
    >
      { menuItems }
    </Dropdown>
    <div className="ui segment main-content">
      { children }
    </div>
  </div>
);

type DownloadItemIdType = string;

export type DownloadDialogUserGetter<ItemT extends UI.DownloadableItemInfo> = (
  itemId: DownloadItemIdType, 
  props: Props<ItemT>
) => API.HintedUserBase;

export type DownloadDialogItemDataGetter<ItemT extends UI.DownloadableItemInfo> = (
  itemId: DownloadItemIdType, 
  socket: APISocket
) => Promise<ItemT>;

interface DownloadDialogProps<ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo> {
  downloadHandler: UI.DownloadHandler<ItemT>;
  itemDataGetter: DownloadDialogItemDataGetter<ItemT>;
  userGetter?: DownloadDialogUserGetter<ItemT>;
}

interface RouteProps { 
  downloadItemId: DownloadItemIdType; 
}

type DownloadDialogRouteProps = ModalRouteDecoratorChildProps<RouteProps>;

interface DownloadDialogDataProps<ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo> 
extends DataProviderDecoratorChildProps {
  sharePaths: API.GroupedPath[];
  favoritePaths: API.GroupedPath[];
  historyPaths: string[];
  itemInfo: ItemT;
}


type Props<ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo> = DownloadDialogProps<ItemT> & 
  DownloadDialogDataProps<ItemT> & 
  DownloadDialogRouteProps;




const getMenuItem = (
  section: DownloadSection, 
  activeSection: string, 
  onClick: (key: string) => void, 
  t: i18next.TFunction
) => (
  <MenuItemLink 
    key={ section.key }
    onClick={ () => onClick(section.key) } 
    active={ activeSection === section.key }
  >
    { t(toI18nKey(section.key, UI.Modules.COMMON), section.name) }
    { !!section.list && (
      <div className="ui small right label"> 
        { section.list.length }
      </div>
    ) }
  </MenuItemLink>
);

const DownloadDialog: React.FC<Props> = props => {
  const { t } = useTranslation();
  const modalRef = useRef<Modal>(null);
  const [ activeSectionKey, setActiveSectionKey ] = useState('history');

  const sections = React.useMemo(
    () => {
      const { historyPaths, sharePaths, favoritePaths, itemInfo } = props;
      const dupePaths = itemInfo.dupe ? itemInfo.dupe.paths.map(path => getParentPath(path)) : [];
  
      return getDownloadSections({
        historyPaths, sharePaths, favoritePaths, dupePaths
      });
    },
    []
  );

  const handleDownload = async (path: string) => {
    const { downloadHandler, itemInfo, userGetter, match } = props;
    try {
      await downloadHandler(
        itemInfo, 
        !!userGetter ? userGetter(match.params.downloadItemId, props) : undefined, 
        {
          target_name: itemInfo.name, // possibly allow changing this later...
          target_directory: path,
          priority: API.QueuePriorityEnum.DEFAULT,
        }
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
      () => addHistory(HistoryStringEnum.DOWNLOAD_DIR, path),
      t
    );

    if (!!modalRef.current) {
      modalRef.current.hide();
    }
  };

  const activeSection = sections.find(s => s.key === activeSectionKey);
  if (!activeSection) {
    return null;
  }

  const menuItems = sections.map(s => getMenuItem(s, activeSectionKey, setActiveSectionKey, t));

  const Component = useMobileLayout() ? MobileLayout : NormalLayout;
  return (
    <Modal 
      ref={ modalRef }
      className="download-dialog" 
      title={ translate('Download', t, UI.Modules.COMMON) }
      closable={ true } 
      icon={ IconConstants.DOWNLOAD }
      fullHeight={ true }
      { ...props }
    >
      <Component
        key={ activeSection.key } // Ensure that section-specific data is refetched
        menuItems={ menuItems }
        title={ activeSection.name }
      >
        <activeSection.component
          t={ t }
          downloadHandler={ handleDownload }
        />
      </Component>
    </Modal>
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