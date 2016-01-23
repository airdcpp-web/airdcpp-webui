'use strict';
import Reflux from 'reflux';
import SystemConstants from 'constants/SystemConstants';
import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';


export const SystemActions = Reflux.createActions([
	{ 'fetchAway': { asyncResult: true } },
	{ 'setAway': { asyncResult: true } },
]);

SystemActions.fetchAway.listen(function () {
	SocketService.get(SystemConstants.MODULE_URL + '/away')
		.then(this.completed)
		.catch(this.failed);
});

SystemActions.setAway.listen(function (away) {
	SocketService.post(SystemConstants.MODULE_URL + '/away', { 
		away,
	})
		.then(this.completed.bind(this, away))
		.catch(this.failed);
});

SystemActions.setAway.completed.listen(function (away, data) {
	NotificationActions.info({ 
		title: away ? 'Away mode was enabled' : 'Away mode was disabled',
		uid: 'away',
	});
});

export default SystemActions;
