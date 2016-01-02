import React from 'react';
import Modal from 'components/semantic/Modal';

import { PriorityEnum } from 'constants/QueueConstants';
import QueueConstants from 'constants/QueueConstants';
import ShareConstants from 'constants/ShareConstants';
import { default as HistoryConstants, HistoryEnum } from 'constants/HistoryConstants';
import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';
import IconConstants from 'constants/IconConstants';

import HistoryActions from 'actions/HistoryActions';

import SocketService from 'services/SocketService';
import { RouteContext } from 'react-router';
import HistoryContext from 'mixins/HistoryContext';

import DownloadFileBrowser from './DownloadFileBrowser';
import { PathList, AccordionTargets } from './DownloadTargets';

import TypeConvert from 'utils/TypeConvert';
import FileUtils from 'utils/FileUtils';
import BrowserUtils from 'utils/BrowserUtils';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';

import Dropdown from 'components/semantic/Dropdown';

import './style.css';


const MenuItem = ({ active, list, title, onClick }) => (
	<a className={ 'item ' + (active ? 'active' : '')	} onClick={ onClick }>
		{ title }
		{ list ? (
			<div className="ui small right label"> { list.length } </div>
		) : null }
	</a>
);

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
	mixins: [ RouteContext, HistoryContext ],
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
			dupe: React.PropTypes.number,
			name: React.PropTypes.string,
			type: React.PropTypes.object
		}),
	},

	getInitialState() {
		return {
			active: 'history',
			share_paths: [],
			dupe_paths: [],
			favorite_paths: [],
			history_paths: []
		};
	},

	fetchPaths(requestPath, stateId) {
		SocketService.get(requestPath).then(data => this.setState({ [stateId]: data })).catch(error => console.error('Failed to fetch paths', requestPath, error.message));
	},

	fetchDupePaths(requestPath) {
		const { itemInfo } = this.props;

		let data = {};
		if (FileUtils.isDirectory(itemInfo.path)) {
			data['path'] = itemInfo.path;
		} else {
			data['tth'] = itemInfo.tth;
		}

		SocketService.post(requestPath, data)
			.then(data => this.setState({ 
				dupe_paths: this.state.dupe_paths.concat(data.map(path => FileUtils.getParentPath(path, FileUtils)))
			}))
			.catch(error => console.error('Failed to fetch dupe paths', requestPath, error.message));
	},

	componentDidMount() {
		this.fetchPaths(ShareConstants.GROUPED_ROOTS_GET_URL, 'share_paths');
		this.fetchPaths(FavoriteDirectoryConstants.DIRECTORIES_URL, 'favorite_paths');
		this.fetchPaths(HistoryConstants.ITEMS_URL + '/' + HistoryEnum.DOWNLOAD_DIR, 'history_paths');

		const { itemInfo } = this.props;
		const dupeName = TypeConvert.dupeToStringType(itemInfo.dupe);
		if (dupeName.indexOf('queue') > -1) {
			this.fetchDupePaths(QueueConstants.DUPE_PATHS_URL);
		}

		if (dupeName.indexOf('share') > -1) {
			this.fetchDupePaths(ShareConstants.DUPE_PATHS_URL);
		}
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
			<MenuItem key={ section.key } 
				title={section.name} 
				onClick={ () => this.setState({ active: section.key }) } 
				active={ this.state.active === section.key }
				list={section.list}
			/>
		);
	},

	render: function () {
		const sections = [
			{
				name: 'Previous',
				key: 'history',
				list: this.state.history_paths,
				component: <PathList paths={ this.state.history_paths } downloadHandler={ this.handleDownload }/>
			}, {
				name: 'Shared',
				key: 'shared',
				list: this.state.share_paths,
				component: <AccordionTargets groupedPaths={ this.state.share_paths } downloadHandler={ this.handleDownload }/>
			}, {
				name: 'Favorites',
				key: 'favorites',
				list: this.state.favorite_paths,
				component: <AccordionTargets groupedPaths={ this.state.favorite_paths } downloadHandler={ this.handleDownload }/>
			}, {
				name: 'Dupes',
				key: 'dupes',
				list: this.state.dupe_paths,
				component: <PathList paths={ this.state.dupe_paths } downloadHandler={ this.handleDownload }/>
			}
		];

		if (LoginStore.hasAccess(AccessConstants.FILESYSTEM_VIEW)) {
			sections.push({
				name: 'Browse',
				key: 'browse',
				component: <DownloadFileBrowser history={ this.state.history_paths } downloadHandler={ this.handleDownload }/>
			});
		}

		const section = sections.find(section => section.key === this.state.active);
		const menuItems = sections.map(this.getMenuItem);

		const Component = BrowserUtils.useMobileLayout() ? MobileLayout : NormalLayout;
		return (
			<Modal 
				ref="modal" 
				className="download-dialog" 
				title="Download" 
				closable={true} 
				icon={ IconConstants.DOWNLOAD }
				fullHeight={true}
				{...this.props}
			>
				<Component
					menuItems={ menuItems }
					section={ section }
				/>
			</Modal>);
	}
});

export default DownloadDialog;