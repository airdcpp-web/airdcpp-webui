'use strict';
import Reflux from 'reflux';
import FilelistConstants from 'constants/FilelistConstants';
import QueueConstants from 'constants/QueueConstants';

import ShareActions from 'actions/ShareActions';
import SocketService from 'services/SocketService';

import History from 'utils/History';
import FilelistSessionStore from 'stores/FilelistSessionStore';
import NotificationActions from 'actions/NotificationActions';

import SessionActionDecorator from 'decorators/action/SessionActionDecorator';
import AccessConstants from 'constants/AccessConstants';
import IconConstants from 'constants/IconConstants';


const isMe = ({ session }) => session.user.flags.indexOf('me') !== -1;

const FilelistActions = Reflux.createActions([
	{ 'createSession': { asyncResult: true } },
	{ 'changeDirectory': { asyncResult: true } },
	{ 'reloadDirectory': { 
		asyncResult: true,
		displayName: 'Reload',
		access: AccessConstants.FILELISTS_VIEW,
		icon: IconConstants.RELOAD,
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

FilelistActions.download.listen((itemData, downloadData) => {
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

		SocketService.post(QueueConstants.BUNDLE_URL + '/file', data)
			.then(FilelistActions.download.completed)
			.catch(error => FilelistActions.download.failed(itemData, error));

		return;
	}

	// Directory
	data['list_path'] = itemData.itemInfo.path;
	SocketService.post(FilelistConstants.MODULE_URL + '/download_directory', data)
		.then(FilelistActions.download.completed)
		.catch(error => FilelistActions.download.failed(itemData, error));
});

FilelistActions.download.failed.listen((itemData, error) => {
	NotificationActions.error({
		title: itemData.itemInfo.name,
		message: 'Failed to queue the item: ' + error.message,
	});
});

FilelistActions.changeDirectory.listen(function (cid, path) {
	let that = this;
	SocketService.post(FilelistConstants.SESSION_URL + '/' + cid + '/directory', { list_path: path })
		.then(data => that.completed(cid, data))
		.catch(error => that.failed(cid, error));
});

FilelistActions.reloadDirectory.listen(function ({ directory, session }) {
	let that = this;
	SocketService.post(FilelistConstants.SESSION_URL + '/' + session.id + '/directory', { 
		list_path: directory.path,
		reload: true,
	})
		.then(data => that.completed(session, data))
		.catch(error => that.failed(session, error));
});

FilelistActions.createSession.listen(function (location, user, directory = '/') {
	let session = FilelistSessionStore.getSession(user.cid);
	if (session) {
		this.completed(location, user, directory, session);
		return;
	}

	let that = this;
	SocketService.post(FilelistConstants.SESSION_URL, {
		user: {
			cid: user.cid,
			hub_url: user.hub_url,
		},
		directory: directory,
	})
		.then((data) => that.completed(location, user, directory, data))
		.catch(that.failed);
});

FilelistActions.findNfo.listen(function ({ user, itemInfo }) {
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

FilelistActions.createSession.completed.listen(function (location, user, directory, session) {
	History.pushSidebar(location, '/filelists/session/' + user.cid, { 
		directory: directory,
		pending: true
	});
});

FilelistActions.createSession.failed.listen(function (error) {
	NotificationActions.error({ 
		title: 'Failed to create filelist session',
		message: error.message,
	});
});

FilelistActions.refreshShare.listen(function ({ session, directory }) {
	ShareActions.refreshVirtual(directory.path, session.profile);
});

export default SessionActionDecorator(FilelistActions, FilelistConstants.MODULE_URL, AccessConstants.FILELISTS_EDIT);
