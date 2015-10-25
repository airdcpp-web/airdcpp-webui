import Reflux from 'reflux';

import { QUEUE_MODULE_URL, BUNDLE_STATUS, StatusEnum } from 'constants/QueueConstants';

import History from 'utils/History';

import NotificationActions from 'actions/NotificationActions';
import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';

const NotificationStore = Reflux.createStore({
	listenables: NotificationActions,
	init: function () {
	},

	onSuccess(...props) {
		this.trigger('success', ...props);
	},

	onInfo(...props) {
		this.trigger('info', ...props);
	},

	onWarning(...props) {
		this.trigger('warning', ...props);
	},

	onError(...props) {
		this.trigger('error', ...props);
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(QUEUE_MODULE_URL, BUNDLE_STATUS, this._onBundleStatus);
	},

	_onBundleStatus: function (bundle) {
		let text;
		let level;
		switch (bundle.status.id) {
			case StatusEnum.STATUS_QUEUED: break;
			case StatusEnum.STATUS_FAILED_MISSING:
			case StatusEnum.STATUS_SHARING_FAILED: {
				text = 'Scanning failed for the bundle: ' + bundle.status.str;
				level = 'error';
				break;
			};
			case StatusEnum.STATUS_FINISHED: {
				text = 'The bundle has finished downloading';
				level = 'info';
				break;
			};
			case StatusEnum.STATUS_HASH_FAILED: {
				text = 'Failed to hash the bundle: ' + bundle.status.str;
				level = 'error';
				break;
			};
			case StatusEnum.STATUS_HASHED: {
				text = 'The bundle has finished hashing';
				level = 'info';
				break;
			};
			case StatusEnum.STATUS_SHARED: {
				text = 'The bundle has been added in share';
				level = 'info';
				break;
			};
		}

		if (level) {
			this.trigger('info', {
				title: bundle.name,
				message: text,
				uid: bundle.id,
				action: {
					label: 'View queue',
					callback: () => { 
						History.pushState(null, '/queue'); 
					}
				}
			});
		}
	}
});

export default SocketSubscriptionDecorator(NotificationStore);
