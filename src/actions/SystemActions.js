'use strict';
import Reflux from 'reflux';
import SystemConstants from 'constants/SystemConstants';
import SocketService from 'services/SocketService';

import AccessConstants from 'constants/AccessConstants';
import ConfirmDialog from 'components/semantic/ConfirmDialog';
import IconConstants from 'constants/IconConstants';
import NotificationActions from 'actions/NotificationActions';


export const SystemActions = Reflux.createActions([
	{ 'fetchAway': { asyncResult: true } },
	{ 'setAway': { asyncResult: true } },
	{ 'restartWeb': { 
		asyncResult: true,
		children: [ 'confirmed' ], 
		displayName: 'Restart web server',
		access: AccessConstants.ADMIN,
		icon: IconConstants.REFRESH,
	} },
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

SystemActions.restartWeb.shouldEmit = function () {
	const options = {
		title: this.displayName,
		content: "When changing the binding options, it's recommended to restart the web server only when you are able to access the server for troubleshooting. If  \
							the web server won't come back online, you should start the application manually to see if there are any error messages. The configuration file is location in your \
							user directory by default (inside .airdc++ directory) in case you need to edit it manually.",
		icon: this.icon,
		approveCaption: 'Continue and restart',
		rejectCaption: "Don't restart",
	};

	ConfirmDialog(options, this.confirmed.bind(this));
};

SystemActions.restartWeb.confirmed.listen(function () {
	let that = this;
	SocketService.post(SystemConstants.MODULE_URL + '/restart_web')
		.then(that.completed)
		.catch(that.failed);
});

SystemActions.setAway.completed.listen(function (away, data) {
	NotificationActions.info({ 
		title: away ? 'Away mode was enabled' : 'Away mode was disabled',
		uid: 'away',
	});
});

export default SystemActions;
