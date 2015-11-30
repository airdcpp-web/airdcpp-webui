'use strict';
import Reflux from 'reflux';
import { BUNDLE_URL, StatusEnum } from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import ConfirmDialog from 'components/semantic/ConfirmDialog';
import { ICON_REMOVE, ICON_SEARCH } from 'constants/IconConstants';

export const QueueActions = Reflux.createActions([
	{ 'searchBundle': { 
		asyncResult: true, 
		displayName: 'Search for alternates', 
		icon: ICON_SEARCH } 
	},
	{ 'setBundlePriority': { 
		asyncResult: true, 
		displayName: 'Set priority' } 
	},
	{ 'removeBundle': { 
		asyncResult: true, 
		children: [ 'confirmed' ], 
		displayName: 'Remove', 
		icon: ICON_REMOVE } 
	},
]);

QueueActions.setBundlePriority.listen(function (bundleId, newPrio) {
	let that = this;
	return SocketService.patch(BUNDLE_URL + '/' + bundleId, {
		priority: newPrio
	})
		.then(that.completed)
		.catch(this.failed);
});

QueueActions.removeBundle.shouldEmit = function (bundle) {
	if (bundle.status.id >= StatusEnum.STATUS_FINISHED) {
		// No need to confirm finished bundles
		this.confirmed(bundle);
	} else {
		const text = 'Are you sure that you want to remove the bundle ' + bundle.name + '?';
		ConfirmDialog(this.displayName, text, this.icon, 'Remove bundle', "Don't remove").then(() => this.confirmed(bundle));
	}
	return false;
};

QueueActions.removeBundle.confirmed.listen(function (bundle) {
	let that = this;
	console.log('Remove succeed');
	return SocketService.delete(BUNDLE_URL + '/' + bundle.id)
		.then(that.completed)
		.catch(this.failed);
});

QueueActions.searchBundle.listen(function (bundle) {
	let that = this;
	return SocketService.post(BUNDLE_URL + '/' + bundle.id + '/search')
		.then(that.completed)
		.catch(this.failed);
});

export default QueueActions;
