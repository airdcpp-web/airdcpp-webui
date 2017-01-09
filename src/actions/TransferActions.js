'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';
import QueueActions from 'actions/QueueActions';

import { default as TransferConstants, StatusEnum } from 'constants/TransferConstants';
import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';


const isFilelist = transfer => transfer.type && transfer.type.content_type === 'filelist';
const isDownload = transfer => transfer.download;
const isFinished = transfer => transfer.status.id === StatusEnum.FINISHED;
const removeFile = transfer => isDownload(transfer) && isFilelist(transfer) && !isFinished(transfer);
const removeSource = transfer => isDownload(transfer) && !isFinished(transfer);

const TransferActions = Reflux.createActions([
	{ 'force': { 
		asyncResult: true,
		displayName: 'Force connect',
		access: AccessConstants.TRANSFERS,
		icon: IconConstants.REFRESH,
		filter: isDownload,
	} },
	{ 'disconnect': { 
		asyncResult: true,
		displayName: 'Disconnect',
		access: AccessConstants.TRANSFERS, 
		icon: IconConstants.DISCONNECT,
	} },
	{ 'removeFile': { 
		asyncResult: true,
		displayName: 'Remove file from queue',
		access: AccessConstants.QUEUE_EDIT, 
		icon: IconConstants.REMOVE,
		filter: removeFile,
	} },
	{ 'removeSource': { 
		asyncResult: true,
		displayName: 'Remove user from queue',
		access: AccessConstants.QUEUE_EDIT, 
		icon: IconConstants.REMOVE,
		filter: removeSource,
	} },
]);

TransferActions.force.listen(function (transfer) {
	const that = this;
	return SocketService.post(TransferConstants.TRANSFER_URL + '/' + transfer.id + '/force')
		.then(that.completed)
		.catch(that.failed);
});

TransferActions.disconnect.listen(function (transfer) {
	const that = this;
	return SocketService.post(TransferConstants.TRANSFER_URL + '/' + transfer.id + '/disconnect')
		.then(that.completed)
		.catch(that.failed);
});

TransferActions.removeFile.listen(function (transfer) {
	return QueueActions.removeFile.confirmed(transfer);
});

TransferActions.removeSource.listen(function (transfer) {
	return QueueActions.removeSource(transfer);
});

export default TransferActions;
