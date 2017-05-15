'use strict';
import Reflux from 'reflux';

import FilelistConstants from 'constants/FilelistConstants';
import QueueConstants from 'constants/QueueConstants';

import ShareActions from 'actions/ShareActions';
import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';

import AccessConstants from 'constants/AccessConstants';
import IconConstants from 'constants/IconConstants';


const isMe = ({ session }) => session.user.flags.indexOf('self') !== -1;
const isPartialList = ({ session }) => session.partial_list;

const FilelistItemActions = Reflux.createActions([
	{ 'reloadDirectory': { 
		asyncResult: true,
		displayName: 'Reload',
		access: AccessConstants.FILELISTS_VIEW,
		icon: IconConstants.RELOAD,
		filter: isPartialList,
	} },
	{ 'refreshShare': { 
		asyncResult: true,
		displayName: 'Refresh in share',
		access: AccessConstants.SETTINGS_EDIT,
		icon: IconConstants.REFRESH,
		filter: isMe,
	} },
	{ 'download': { asyncResult: true } },
	{ 'findNfo': { asyncResult: true } },
]);

FilelistItemActions.download.listen((itemData, downloadData) => {
	const data = {
		user: itemData.user,
		...downloadData,
	};

	if (itemData.itemInfo.type.id === 'file') {
		const { tth, size, time } = itemData.itemInfo;
		Object.assign(data, {
			tth,
			size,
			time,
		});

		SocketService.post(QueueConstants.BUNDLES_URL + '/file', data)
			.then(FilelistItemActions.download.completed)
			.catch(error => FilelistItemActions.download.failed(itemData, error));

		return;
	}

	// Directory
	data['list_path'] = itemData.itemInfo.path;
	SocketService.post(FilelistConstants.DIRECTORY_DOWNLOADS_URL, data)
		.then(FilelistItemActions.download.completed)
		.catch(error => FilelistItemActions.download.failed(itemData, error));
});

FilelistItemActions.download.failed.listen((itemData, error) => {
	NotificationActions.apiError('Failed to queue the item ' + itemData.itemInfo.name, error);
});

FilelistItemActions.reloadDirectory.listen(function ({ directory, session }) {
	let that = this;
	SocketService.post(FilelistConstants.SESSIONS_URL + '/' + session.id + '/directory', { 
		list_path: directory.path,
		reload: true,
	})
		.then(data => that.completed(session, data))
		.catch(error => that.failed(session, error));
});

FilelistItemActions.findNfo.listen(function ({ user, itemInfo }) {
	let that = this;
	SocketService.post(FilelistConstants.FIND_NFO_URL, {
		user: {
			cid: user.cid,
			hub_url: user.hub_url,
		},
		directory: itemInfo.path,
	})
		.then((data) => that.completed(user, itemInfo, data))
		.catch(that.failed);
});

FilelistItemActions.refreshShare.listen(function ({ session, directory }) {
	ShareActions.refreshVirtual(directory.path, session.share_profile.id);
});

export default FilelistItemActions;
