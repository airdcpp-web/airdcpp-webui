'use strict';
import Reflux from 'reflux';
import ViewFileConstants from 'constants/ViewFileConstants';

import SocketService from 'services/SocketService';

import History from 'utils/History';
import ViewFileStore from 'stores/ViewFileStore';
import NotificationActions from 'actions/NotificationActions';

import SessionActionDecorator from 'decorators/action/SessionActionDecorator';
import AccessConstants from 'constants/AccessConstants';


const ViewFileActions = Reflux.createActions([
	{ 'createSession': { asyncResult: true } },
	{ 'setRead': { asyncResult: true } },
]);

ViewFileActions.createSession.listen(function ({ itemInfo, user }, isText, location) {
	let session = ViewFileStore.getSession(itemInfo.tth);
	if (session) {
		this.completed(location, itemInfo, session);
		return;
	}

	const { tth, size, name } = itemInfo;
	const file = {
		user,
		tth,
		size,
		name,
		text: isText,
	};

	let that = this;
	SocketService.post(ViewFileConstants.SESSION_URL, file)
		.then((data) => that.completed(location, file, data))
		.catch(that.failed);
});

ViewFileActions.createSession.completed.listen(function (location, file, session) {
	History.pushSidebar(location, '/files/session/' + file.tth, {
		pending: true
	});
});

ViewFileActions.createSession.failed.listen(function (error) {
	NotificationActions.apiError('Failed to create viewed file', error);
});

ViewFileActions.setRead.listen(function (id) {
	let that = this;
	SocketService.post(ViewFileConstants.SESSION_URL + '/' + id + '/read')
		.then(that.completed)
		.catch(that.failed);
});

export default SessionActionDecorator(ViewFileActions, ViewFileConstants.MODULE_URL, AccessConstants.VIEW_FILE_EDIT);
