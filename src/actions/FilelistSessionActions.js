'use strict';
import Reflux from 'reflux';

import FilelistConstants from 'constants/FilelistConstants';

import LoginStore from 'stores/LoginStore';
import SocketService from 'services/SocketService';

import History from 'utils/History';
import NotificationActions from 'actions/NotificationActions';

import SessionActionDecorator from './decorators/SessionActionDecorator';
import AccessConstants from 'constants/AccessConstants';


const FilelistSessionActions = Reflux.createActions([
	{ 'createSession': { asyncResult: true } },
	{ 'changeDirectory': { asyncResult: true } },
	{ 'ownList': { asyncResult: true } },
	{ 'setRead': { asyncResult: true } },
]);

FilelistSessionActions.changeDirectory.listen(function (cid, path) {
	let that = this;
	SocketService.post(FilelistConstants.SESSIONS_URL + '/' + cid + '/directory', { list_path: path })
		.then(data => that.completed(cid, data))
		.catch(error => that.failed(cid, error));
});

FilelistSessionActions.createSession.listen(function (location, user, sessionStore, directory = '/') {
	const session = sessionStore.getSession(user.cid);
	if (session && session.user.hub_url === user.hub_url) {
		this.completed(location, user, directory, session);
		return;
	}

	let that = this;
	SocketService.post(FilelistConstants.SESSIONS_URL, {
		user: {
			cid: user.cid,
			hub_url: user.hub_url,
		},
		directory: directory,
	})
		.then((data) => that.completed(location, user, directory, data))
		.catch(that.failed);
});

FilelistSessionActions.ownList.listen(function (location, profile, sessionStore) {
	let session = sessionStore.getSession(LoginStore.systemInfo.cid);
	if (session && session.share_profile.id === profile) {
		this.completed(location, profile, session);
		return;
	}

	let that = this;
	SocketService.post(FilelistConstants.SESSIONS_URL + '/self', {
		share_profile: profile,
	})
		.then((data) => that.completed(location, profile, data))
		.catch(that.failed);
});

const openSession = (location, cid, directory) => {
	History.pushSidebar(location, '/filelists/session/' + cid, { 
		directory,
		pending: true
	});
};

FilelistSessionActions.ownList.completed.listen(function (location, profile, session) {
	openSession(location, LoginStore.systemInfo.cid, '/');
});

FilelistSessionActions.createSession.completed.listen(function (location, user, directory, session) {
	openSession(location, user.cid, directory);
});

FilelistSessionActions.createSession.failed.listen(function (error) {
	NotificationActions.apiError('Failed to create filelist session', error);
});

FilelistSessionActions.setRead.listen(function (id) {
	let that = this;
	SocketService.post(FilelistConstants.SESSIONS_URL + '/' + id + '/read')
		.then(that.completed)
		.catch(that.failed);
});

export default SessionActionDecorator(FilelistSessionActions, FilelistConstants.SESSIONS_URL, AccessConstants.FILELISTS_EDIT);
