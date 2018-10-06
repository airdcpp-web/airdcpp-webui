//import PropTypes from 'prop-types';
import React from 'react';

import ShareConstants from 'constants/ShareConstants';
import { default as HistoryConstants, HistoryStringEnum } from 'constants/HistoryConstants';
import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';
import IconConstants from 'constants/IconConstants';

import HistoryActions from 'actions/HistoryActions';

import DownloadFileBrowser from './DownloadFileBrowser';
import PathList from './PathList';
import AccordionTargets from './AccordionTargets';

import { getParentPath } from 'utils/FileUtils';
import { useMobileLayout } from 'utils/BrowserUtils';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';

import LoginStore from 'stores/LoginStore';

import Dropdown from 'components/semantic/Dropdown';
import MenuItemLink from 'components/semantic/MenuItemLink';
import Modal from 'components/semantic/Modal';

import * as API from 'types/api';

import './style.css';
import { RouteComponentProps } from 'react-router';
import { APISocket } from 'airdcpp-apisocket';


interface Section {
  name: string;
  key: string;
  list?: string[] | API.GroupedPath[];
  component: React.ReactNode;
}

interface LayoutProps {
  menuItems: React.ReactNode[];
  section: Section;
}

const NormalLayout: React.SFC<LayoutProps> = ({ menuItems, section }) => (
  <div className="ui grid normal layout">
    <div className="four wide column">
      <div className="ui vertical fluid tabular menu">
        { menuItems }
      </div>
    </div>
    <div className="twelve wide stretched column">
      <div className="ui segment main-content">
        { section.component }
      </div>
    </div>
  </div>
);

const MobileLayout: React.SFC<LayoutProps> = ({ menuItems, section }) => (
  <div className="mobile layout">
    <Dropdown className="selection fluid" caption={ section.name }>
      { menuItems }
    </Dropdown>
    <div className="ui segment main-content">
      { section.component }
    </div>
  </div>
);

type DownloadItemIdType = string;

export type DownloadDialogUserGetter<ItemT extends API.FileItemInfo> = (
  itemId: DownloadItemIdType, 
  props: Props<ItemT>
) => API.HintedUserBase;

export type DownloadDialogItemDataGetter<ItemT extends API.FileItemInfo> = (
  itemId: DownloadItemIdType, 
  socket: APISocket
) => Promise<ItemT>;

export type DownloadHandler<ItemT extends API.FileItemInfo> = (
  itemInfo: ItemT, 
  user: API.HintedUserBase | undefined, 
  downloadData: API.DownloadData
) => void;

interface DownloadDialogProps<ItemT extends API.FileItemInfo = API.FileItemInfo> {
  downloadHandler: DownloadHandler<ItemT>;
  itemDataGetter: DownloadDialogItemDataGetter<ItemT>;
  userGetter?: DownloadDialogUserGetter<ItemT>;
}

type DownloadDialogRouteProps = ModalRouteDecoratorChildProps & RouteComponentProps<{ 
  downloadItemId: DownloadItemIdType; 
}>;

interface DownloadDialogDataProps<ItemT extends API.FileItemInfo = API.FileItemInfo> 
extends DataProviderDecoratorChildProps {
  sharePaths: API.GroupedPath[];
  favoritePaths: API.GroupedPath[];
  historyPaths: string[];
  itemInfo: ItemT;
}


type Props<ItemT extends API.FileItemInfo = API.FileItemInfo> = DownloadDialogProps<ItemT> & 
  DownloadDialogDataProps<ItemT> & 
  DownloadDialogRouteProps;

class DownloadDialog extends React.Component<Props> {
  static displayName = 'DownloadDialog';

  /*static propTypes = {
		// Function handling the path selection. Receives the selected path as argument.
		// Required
    downloadHandler: PropTypes.func.isRequired,

		// Information about the item to download
		// Required
    itemInfo: PropTypes.shape({
      path: PropTypes.string,
      dupe: PropTypes.object,
      name: PropTypes.string,
      type: PropTypes.object
    }),
  };*/

  sections: Section[];
  modal: any;

  constructor(props: Props) {
    super(props);
    const { historyPaths, sharePaths, favoritePaths, itemInfo } = props;
    const dupePaths = itemInfo.dupe ? itemInfo.dupe.paths.map(path => getParentPath(path)) : [];

    this.sections = [
      {
        name: 'Previous',
        key: 'history',
        list: historyPaths,
        component: <PathList paths={ historyPaths } downloadHandler={ this.handleDownload }/>
      }, {
        name: 'Shared',
        key: 'shared',
        list: sharePaths,
        component: <AccordionTargets groupedPaths={ sharePaths } downloadHandler={ this.handleDownload }/>
      }, {
        name: 'Favorites',
        key: 'favorites',
        list: favoritePaths,
        component: <AccordionTargets groupedPaths={ favoritePaths } downloadHandler={ this.handleDownload }/>
      }, {
        name: 'Dupes',
        key: 'dupes',
        list: dupePaths,
        component: <PathList paths={ dupePaths } downloadHandler={ this.handleDownload }/>
      }
    ];

    if (LoginStore.hasAccess(API.AccessEnum.FILESYSTEM_VIEW)) {
      this.sections.push({
        name: 'Browse',
        key: 'browse',
        component: <DownloadFileBrowser history={ historyPaths } downloadHandler={ this.handleDownload }/>
      });
    }
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

  getMenuItem = (section: Section) => {
    return (
      <MenuItemLink 
        key={ section.key }
        onClick={ () => this.setState({ activeSection: section.key }) } 
        active={ this.state.activeSection === section.key }
      >
        { section.name }
        { !!section.list && (
          <div className="ui small right label"> 
            { section.list.length }
          </div>
        ) }
      </MenuItemLink>
    );
  }

  render() {
    const section = this.sections.find(s => s.key === this.state.activeSection);
    if (!section) {
      return null;
    }

    const menuItems = this.sections.map(this.getMenuItem);

    const Component = useMobileLayout() ? MobileLayout : NormalLayout;
    return (
      <Modal 
        ref={ c => this.modal = c }
        className="download-dialog" 
        title="Download" 
        closable={ true } 
        icon={ IconConstants.DOWNLOAD }
        fullHeight={ true }
        { ...this.props }
      >
        <Component
          key={ section.key } // Ensure that section-specific data is refetched
          menuItems={ menuItems }
          section={ section }
        />
      </Modal>);
  }
}

export default ModalRouteDecorator<DownloadDialogProps>(
  DataProviderDecorator<DownloadDialogProps & DownloadDialogRouteProps, DownloadDialogDataProps>(DownloadDialog, {
    urls: {
      sharePaths: ShareConstants.GROUPED_ROOTS_GET_URL,
      favoritePaths: FavoriteDirectoryConstants.GROUPED_DIRECTORIES_URL,
      historyPaths: HistoryConstants.STRINGS_URL + '/' + HistoryStringEnum.DOWNLOAD_DIR,
      itemInfo: ({ match, itemDataGetter }, socket) => {
        return itemDataGetter(match.params.downloadItemId, socket);
      }
    },
  }),
  'download/:downloadItemId'
);