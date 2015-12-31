'use strict';
import Reflux from 'reflux';
import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';
import IconConstants from 'constants/IconConstants';


export default function (actions, moduleUrl, editAccess) {
	const SessionActions = Reflux.createActions([
		{ 'fetchSessions': { asyncResult: true } },
		{ 'removeSession': { 
			asyncResult: true ,
			displayName: 'Close',
			access: editAccess,
			icon: IconConstants.REMOVE },
		},

		'sessionChanged',
	]);

	SessionActions.fetchSessions.listen(function () {
		let that = this;
		SocketService.get(moduleUrl + '/sessions')
			.then(that.completed)
			.catch(that.failed);
	});

	SessionActions.fetchSessions.failed.listen(function (error) {
		NotificationActions.apiError('Failed to fetch sessions', error);
	});

	SessionActions.removeSession.listen(function (session) {
		let that = this;
		SocketService.delete(moduleUrl + '/session/' + session.id)
			.then(that.completed.bind(this, session))
			.catch(that.failed.bind(this, session));
	});

	SessionActions.removeSession.failed.listen(function (session, error) {
		NotificationActions.error({ 
			title: 'Failed to remove session: ' + session.id,
			message: error.message,
		});
	});

	return Object.assign(actions, SessionActions);
}