import React from 'react';
import Reflux from 'reflux';

import PrivateChatConstants from 'constants/PrivateChatConstants';
import ViewFileConstants from 'constants/ViewFileConstants';
import { default as QueueConstants, StatusEnum } from 'constants/QueueConstants';
import { default as EventConstants, SeverityEnum } from 'constants/EventConstants';

import NotificationSystem from 'react-notification-system';
import NotificationStore from 'stores/NotificationStore';
import NotificationActions from 'actions/NotificationActions';

import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';
import History from 'utils/History';

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';

import Logo from '../../../images/AirDCPlusPlus.png';

import LoginStore from 'stores/LoginStore';
import AccessConstants from 'constants/AccessConstants';


const Notifications = React.createClass({
	mixins: [ SocketSubscriptionMixin(), Reflux.listenTo(NotificationStore, '_addNotification') ],

	_notificationSystem: null,

	_addNotification: function (level, notification) {
		if ('Notification' in window && Notification.permission === 'granted') {
			this.showNativeNotification(level, notification);
			return;
		}

		this._notificationSystem.addNotification(Object.assign(notification, {
			level: level,
			position: 'tl',
			autoDismiss: 5
		}));
	},

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	},

	showNativeNotification(level, notificationInfo) {
		var options = {
			body: notificationInfo.message,
			icon: Logo,
			tag: notificationInfo.uid,
		};

		const n = new Notification(notificationInfo.title, options);
		n.onclick = () => {
			window.focus();
			if (notificationInfo.action) {
				notificationInfo.action.callback();
			}
		};

		setTimeout(n.close.bind(n), 5000);
	},

	componentDidMount: function () {
		if ('Notification' in window) {
			Notification.requestPermission();
		}

		this._notificationSystem = this.refs.notificationSystem;
	},

	render: function () {
		return (
			<NotificationSystem ref="notificationSystem" />
		);
	},

	onSocketConnected(addSocketListener) {
		if (LoginStore.hasAccess(AccessConstants.PRIVATE_CHAT_VIEW)) {
			addSocketListener(PrivateChatConstants.MODULE_URL, PrivateChatConstants.MESSAGE, this._onPrivateMessage);
		}

		if (LoginStore.hasAccess(AccessConstants.QUEUE_VIEW)) {
			addSocketListener(QueueConstants.MODULE_URL, QueueConstants.BUNDLE_STATUS, this._onBundleStatus);
		}

		if (LoginStore.hasAccess(AccessConstants.EVENTS)) {
			addSocketListener(EventConstants.MODULE_URL, EventConstants.LOG_MESSAGE, this._onLogMessage);
		}

		if (LoginStore.hasAccess(AccessConstants.VIEW_FILE_VIEW)) {
			addSocketListener(ViewFileConstants.MODULE_URL, ViewFileConstants.FILE_DOWNLOADED, this._onViewFileDownloaded);
		}
	},

	getSeverityStr(severity) {
		switch (severity) {
			case SeverityEnum.NOTIFY: return 'Information';
			case SeverityEnum.ERROR: return 'ERROR';
			case SeverityEnum.WARNING: return 'WARNING';
			default: return null;
		}
	},

	_onLogMessage(message) {
		const { text, id, severity } = message;
		if (severity === SeverityEnum.INFO) {
			return;
		}

		const notification = {
			title: this.getSeverityStr(severity),
			message: text,
			uid: id,
		};

		if (severity !== SeverityEnum.NOTIFY) {
			Object.assign(notification, {
				action: {
					label: 'View events',
					callback: severity === SeverityEnum.NOTIFY ? null : () => { 
						History.pushSidebar(this.props.location, 'events'); 
					}
				}
			});
		}

		if (severity === SeverityEnum.WARNING) {
			NotificationActions.warning(notification);
		} else {
			NotificationActions.error(notification);
		}
	},

	_onViewFileDownloaded(file) {
		if (!file.downloaded) {
			return;
		}

		NotificationActions.info({
			title: file.name,
			message: 'File has finished downloading',
			uid: file.id,
			action: {
				label: 'View file',
				callback: () => { 
					History.pushSidebar(this.props.location, '/files/session/' + file.id); 
				}
			}
		});
	},

	_onPrivateMessage(message) {
		const cid = message.reply_to.cid;
		if (message.is_read || (PrivateChatSessionStore.getActiveSession() === cid && document.hasFocus())) {
			return;
		}

		NotificationActions.info({
			title: message.from.nick,
			message: message.text,
			uid: cid,
			action: {
				label: 'View message',
				callback: () => { 
					History.pushSidebar(this.props.location, '/messages/session/' + cid); 
				}
			}
		});
	},

	_onBundleStatus: function (bundle) {
		let text;
		let level;
		switch (bundle.status.id) {
			case StatusEnum.QUEUED: {
				text = 'The bundle has been added in queue';
				level = 'info';
				break;
			}
			case StatusEnum.DOWNLOAD_FAILED: {
				text = 'Download failed: ' + bundle.status.str;
				level = 'error';
				break;
			};
			case StatusEnum.FAILED_MISSING:
			case StatusEnum.SHARING_FAILED: {
				text = 'Scanning failed for the bundle: ' + bundle.status.str;
				level = 'error';
				break;
			};
			case StatusEnum.FINISHED: {
				text = 'The bundle has finished downloading';
				level = 'info';
				break;
			};
			case StatusEnum.HASH_FAILED: {
				text = 'Failed to hash the bundle: ' + bundle.status.str;
				level = 'error';
				break;
			};
			case StatusEnum.HASHED: {
				text = 'The bundle has finished hashing';
				level = 'info';
				break;
			};
			case StatusEnum.SHARED: {
				text = 'The bundle has been added in share';
				level = 'info';
				break;
			};
		}

		if (level) {
			NotificationActions.info({
				title: bundle.name,
				message: text,
				uid: bundle.id,
				action: {
					label: 'View queue',
					callback: () => { 
						History.push({
							pathname: '/queue',
						}); 
					}
				}
			});
		}
	}
});

export default Notifications;
