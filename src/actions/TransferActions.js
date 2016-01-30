'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';
import NotificationActions from 'actions/NotificationActions';

import TransferConstants from 'constants/TransferConstants';
import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';


const isDownload = transfer => transfer.download;

const TransferActions = Reflux.createActions([
	{ 'force': { 
		asyncResult: true,
		displayName: 'Force connect',
		access: AccessConstants.SETTINGS_EDIT,
		icon: IconConstants.REFRESH,
		filter: isDownload,
	} },
	{ 'disconnect': { 
		asyncResult: true,
		displayName: 'Disconnect',
		access: AccessConstants.SETTINGS_EDIT, 
		icon: IconConstants.REMOVE,
	} },
]);

TransferActions.force.listen(function (transfer) {
	const that = this;
	return SocketService.post(TransferConstants.FORCE_URL + '/' + transfer.id)
		.then(that.completed)
		.catch(that.failed);
});

TransferActions.disconnect.listen(function (transfer) {
	const that = this;
	return SocketService.post(TransferConstants.DISCONNECT_URL + '/' + transfer.id)
		.then(that.completed)
		.catch(that.failed);
});

/*TransferActions.disconnect.failed.listen(function (error) {
	NotificationActions.error({ 
		title: 'Refresh failed',
		message: error.message,
	});
});*/

export default TransferActions;
