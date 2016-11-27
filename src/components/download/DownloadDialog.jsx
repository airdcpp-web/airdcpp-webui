import React from 'react';
import Modal from 'components/semantic/Modal';

import { PriorityEnum } from 'constants/QueueConstants';
import ShareConstants from 'constants/ShareConstants';
import { default as HistoryConstants, HistoryEnum } from 'constants/HistoryConstants';
import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';
import IconConstants from 'constants/IconConstants';

import HistoryActions from 'actions/HistoryActions';

import { RouteContext } from 'mixins/RouterMixin';

import DownloadFileBrowser from './DownloadFileBrowser';
import PathList from './PathList';
import AccordionTargets from './AccordionTargets';

import FileUtils from 'utils/FileUtils';
import BrowserUtils from 'utils/BrowserUtils';
import DataProviderDecorator from 'decorators/DataProviderDecorator';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';

import Dropdown from 'components/semantic/Dropdown';
import { MenuItemLink } from 'components/semantic/MenuItem';

import './style.css';


const NormalLayout = ({ menuItems, section }) => (
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

const MobileLayout = ({ menuItems, section }) => (
	<div className="mobile layout">
		<Dropdown className="selection fluid" caption={ section.name }>
			{ menuItems }
		</Dropdown>
		<div className="ui segment main-content">
			{ section.component }
		</div>
	</div>
);

const DownloadDialog = React.createClass({
	mixins: [ RouteContext ],
	propTypes: {
		/**
		 * Function handling the path selection. Receives the selected path as argument.
		 * Required
		 */
		downloadHandler: React.PropTypes.func,

		/**
		 * Information about the item to download
		 * Required
		 */
		itemInfo: React.PropTypes.shape({
			path: React.PropTypes.string,
			dupe: React.PropTypes.object,
			name: React.PropTypes.string,
			type: React.PropTypes.object
		}),
	},

	getInitialState() {
		const { historyPaths, sharePaths, favoritePaths, itemInfo } = this.props;
		const dupePaths = itemInfo.dupe ? itemInfo.dupe.paths.map(path => FileUtils.getParentPath(path, FileUtils)) : [];

		this.sections = [
			{
				name: 'Previous',
				key: 'history',
				list: historyPaths,
				component: <PathList key="history" paths={ historyPaths } downloadHandler={ this.handleDownload }/>
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
				component: <PathList key="dupes" paths={ dupePaths } downloadHandler={ this.handleDownload }/>
			}
		];

		if (LoginStore.hasAccess(AccessConstants.FILESYSTEM_VIEW)) {
			this.sections.push({
				name: 'Browse',
				key: 'browse',
				component: <DownloadFileBrowser history={ historyPaths } downloadHandler={ this.handleDownload }/>
			});
		}

		return {
			active: 'history',
		};
	},

	handleDownload(path) {
		this.props.downloadHandler({
			target_name: this.props.itemInfo.name, // possibly allow changing this later...
			target_directory: path,
			target_type: 0,
			priority: PriorityEnum.DEFAULT
		});

		HistoryActions.add(HistoryEnum.DOWNLOAD_DIR, path);
		this.refs.modal.hide();
	},

	getMenuItem(section) {
		return (
			<MenuItemLink 
				key={ section.key }
				onClick={ () => this.setState({ active: section.key }) } 
				active={ this.state.active === section.key }
			>
				{ section.name }
				{ section.list && (
					<div className="ui small right label"> 
						{ section.list.length }
					</div>
				) }
			</MenuItemLink>
		);
	},

	render: function () {
		const section = this.sections.find(section => section.key === this.state.active);
		const menuItems = this.sections.map(this.getMenuItem);

		const Component = BrowserUtils.useMobileLayout() ? MobileLayout : NormalLayout;
		return (
			<Modal 
				ref="modal" 
				className="download-dialog" 
				title="Download" 
				closable={ true } 
				icon={ IconConstants.DOWNLOAD }
				fullHeight={ true }
				{ ...this.props }
			>
				<Component
					menuItems={ menuItems }
					section={ section }
				/>
			</Modal>);
	}
});

export default DataProviderDecorator(DownloadDialog, {
	urls: {
		sharePaths: ShareConstants.GROUPED_ROOTS_GET_URL,
		favoritePaths: FavoriteDirectoryConstants.GROUPED_DIRECTORIES_URL,
		historyPaths: HistoryConstants.ITEMS_URL + '/' + HistoryEnum.DOWNLOAD_DIR,
	},
});