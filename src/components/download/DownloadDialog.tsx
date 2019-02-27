//import PropTypes from 'prop-types';
import React from 'react';

import ShareConstants from 'constants/ShareConstants';
import { default as HistoryConstants, HistoryStringEnum } from 'constants/HistoryConstants';
import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';
import IconConstants from 'constants/IconConstants';

import HistoryActions from 'actions/reflux/HistoryActions';

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

import { RouteComponentProps } from 'react-router-dom';
import { APISocket } from 'airdcpp-apisocket';
//import { DownloadHandler, DownloadableItemInfo } from 'types';

import i18next from 'i18next';
import { toI18nKey, translate } from 'utils/TranslationUtils';
import { Translation } from 'react-i18next';
import { getDownloadSections, DownloadSection } from './sections';


interface LayoutProps {
  menuItems: React.ReactNode[];
  title: string;
}

const NormalLayout: React.FC<LayoutProps> = ({ menuItems, title, children }) => (
  <div className="ui grid normal layout">
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
  </div>
);

const MobileLayout: React.FC<LayoutProps> = ({ menuItems, title, children }) => (
  <div className="mobile layout">
    <Dropdown className="selection fluid" caption={ title }>
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

type DownloadDialogRouteProps = ModalRouteDecoratorChildProps & RouteComponentProps<{ 
  downloadItemId: DownloadItemIdType; 
}>;

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

class DownloadDialog extends React.Component<Props> {
  static displayName = 'DownloadDialog';

  sections: DownloadSection[];
  modal: any;

  constructor(props: Props) {
    super(props);
    const { historyPaths, sharePaths, favoritePaths, itemInfo } = props;
    const dupePaths = itemInfo.dupe ? itemInfo.dupe.paths.map(path => getParentPath(path)) : [];

    this.sections = getDownloadSections({
      historyPaths, sharePaths, favoritePaths, dupePaths
    });
  }

  state = {
    activeSection: 'history',
  };

  handleDownload = (path: string) => {
    const { downloadHandler, itemInfo, userGetter, match } = this.props;
    downloadHandler(
      itemInfo, 
      !!userGetter ? userGetter(match.params.downloadItemId, this.props) : undefined, 
      {
        target_name: itemInfo.name, // possibly allow changing this later...
        target_directory: path,
        priority: API.QueuePriorityEnum.DEFAULT,
      }
    );

    HistoryActions.add(HistoryStringEnum.DOWNLOAD_DIR, path);
    this.modal.hide();
  }

  handleClickSession = (key: string) => {
    this.setState({ 
      activeSection: key,
    });
  }

  render() {
    const { sections } = this;
    const { activeSection: activeSessionKey } = this.state;
    const activeSection = sections.find(s => s.key === this.state.activeSection);
    if (!activeSection) {
      return null;
    }

    const Component = useMobileLayout() ? MobileLayout : NormalLayout;
    return (
      <Translation>
        { t => {
          const menuItems = sections.map(s => getMenuItem(s, activeSessionKey, this.handleClickSession, t));
          return (
            <Modal 
              ref={ c => this.modal = c }
              className="download-dialog" 
              title={ translate('Download', t, UI.Modules.COMMON) }
              closable={ true } 
              icon={ IconConstants.DOWNLOAD }
              fullHeight={ true }
              { ...this.props }
            >
              <Component
                key={ activeSection.key } // Ensure that section-specific data is refetched
                menuItems={ menuItems }
                title={ activeSection.name }
              >
                <activeSection.component
                  t={ t }
                  downloadHandler={ this.handleDownload }
                />
              </Component>
            </Modal>
          );
        } }
      </Translation>
    );
  }
}

export default ModalRouteDecorator<DownloadDialogProps>(
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