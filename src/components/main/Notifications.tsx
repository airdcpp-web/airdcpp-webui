import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';

//@ts-ignore
import Reflux from 'reflux';

import AccessConstants from 'constants/AccessConstants';
import PrivateChatConstants from 'constants/PrivateChatConstants';
import ViewFileConstants from 'constants/ViewFileConstants';
import { default as QueueConstants } from 'constants/QueueConstants';
import { default as EventConstants } from 'constants/EventConstants';

import { default as  NotificationSystem, Notification as ReactNotification } from 'react-notification-system';
import NotificationStore from 'stores/NotificationStore';
import NotificationActions from 'actions/NotificationActions';

import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';
import History from 'utils/History';

import LocalSettingStore from 'stores/LocalSettingStore';
import { LocalSettings } from 'constants/SettingConstants';

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';

//@ts-ignore
import Logo from 'images/AirDCPlusPlus.png';


type NotificationLevel = 'error' | 'warning' | 'info' | 'success';

const getSeverityStr = (severity: API.Severity) => {
  switch (severity) {
    case API.Severity.NOTIFY: return 'Information';
    case API.Severity.INFO: return 'INFO';
    case API.Severity.ERROR: return 'ERROR';
    case API.Severity.WARNING: return 'WARNING';
    default: return '';
  }
};

const Notifications = createReactClass({
  displayName: 'Notifications',
  mixins: [ SocketSubscriptionMixin(), Reflux.listenTo(NotificationStore, 'addNotification') ],
  notifications: null,

  propTypes: {
    location: PropTypes.object.isRequired,
  },

  addNotification: function (level: NotificationLevel, notification: Notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      this.showNativeNotification(level, notification);
      return;
    }

    this.notifications.addNotification({
      ...notification,
      level,
      position: 'tl',
      autoDismiss: 5,
    });
  },

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  },

  showNativeNotification(level: NotificationLevel, notificationInfo: ReactNotification) {
    const options = {
      body: notificationInfo.message,
      icon: Logo,
      tag: notificationInfo.uid ? String(notificationInfo.uid) : undefined,
    };

    const n = new Notification(notificationInfo.title!, options);
    n.onclick = () => {
      window.focus();
      if (!!notificationInfo.action && !!notificationInfo.action.callback) {
        notificationInfo.action.callback();
      }
    };

    setTimeout(n.close.bind(n), 5000);
  },

  componentDidMount() {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  },

  render() {
    return (
      <NotificationSystem 
        ref={ (c: any) => this.notifications = c }
      />
    );
  },

  onSocketConnected(addSocketListener: any) {
    addSocketListener(PrivateChatConstants.MODULE_URL, PrivateChatConstants.MESSAGE, this.onPrivateMessage, null, AccessConstants.PRIVATE_CHAT_VIEW);

    addSocketListener(QueueConstants.MODULE_URL, QueueConstants.BUNDLE_ADDED, this.onBundleStatus, null, AccessConstants.QUEUE_VIEW);
    addSocketListener(QueueConstants.MODULE_URL, QueueConstants.BUNDLE_STATUS, this.onBundleStatus, null, AccessConstants.QUEUE_VIEW);

    addSocketListener(EventConstants.MODULE_URL, EventConstants.MESSAGE, this.onLogMessage, null, AccessConstants.EVENTS_VIEW);
    addSocketListener(ViewFileConstants.MODULE_URL, ViewFileConstants.FILE_DOWNLOADED, this.onViewFileDownloaded, null, AccessConstants.VIEW_FILE_VIEW);
  },

  onLogMessage(message: API.StatusMessage) {
    const { text, id, severity } = message;

    const notification: ReactNotification = {
      title: getSeverityStr(severity),
      message: text,
      uid: id,
    };

    if (severity !== API.Severity.NOTIFY) {
      Object.assign(notification, {
        action: {
          label: 'View events',
          callback: () => { 
            History.pushSidebar(this.props.location, 'events'); 
          }
        }
      } as Partial<ReactNotification>);
    }


    if (severity === API.Severity.NOTIFY) {
      NotificationActions.info(notification);
    } else if (severity === API.Severity.INFO && LocalSettingStore.getValue(LocalSettings.NOTIFY_EVENTS_INFO)) {
      NotificationActions.info(notification);
    } else if (severity === API.Severity.WARNING && LocalSettingStore.getValue(LocalSettings.NOTIFY_EVENTS_WARNING)) {
      NotificationActions.warning(notification);
    } else if (severity === API.Severity.ERROR && LocalSettingStore.getValue(LocalSettings.NOTIFY_EVENTS_ERROR)) {
      NotificationActions.error(notification);
    }
  },

  onViewFileDownloaded(file: API.ViewFile) {
    if (!file.content_ready) {
      return;
    }

    NotificationActions.info({
      title: file.name,
      message: 'File has finished downloading',
      uid: file.id,
      action: {
        label: 'View file',
        callback: () => { 
          History.pushSidebar(this.props.location, `/files/session/${file.id}`); 
        }
      }
    } as ReactNotification);
  },

  onPrivateMessage(message: API.ChatMessage) {
    const cid = message.reply_to!.cid;
    if (message.is_read || (PrivateChatSessionStore.getActiveSession() === cid && document.hasFocus())) {
      return;
    }

    if (message.reply_to!.flags.indexOf('bot') > -1) {
      if (!LocalSettingStore.getValue(LocalSettings.NOTIFY_PM_BOT)) {
        return;
      }
    } else if (!LocalSettingStore.getValue(LocalSettings.NOTIFY_PM_USER)) {
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
    } as ReactNotification);
  },

  onBundleStatus(bundle: API.Bundle) {
    if (!LocalSettingStore.getValue(LocalSettings.NOTIFY_BUNDLE_STATUS)) {
      return;
    }

    let text;
    let level;
    switch (bundle.status.id) {
      case API.BundleStatusId.QUEUED: {
        text = 'Bundle was added in queue';
        level = 'info';
        break;
      }
      case API.BundleStatusId.DOWNLOAD_ERROR: {
        text = 'Download error: ' + bundle.status.str;
        level = 'error';
        break;
      }
      case API.BundleStatusId.COMPLETION_VALIDATION_RUNNING: {
        text = 'Validating downloaded bundle';
        level = 'info';
        break;
      }
      case API.BundleStatusId.COMPLETION_VALIDATION_ERROR: {
        text = `Bundle content validation failed: ${bundle.status.hook_error.str} (${bundle.status.hook_error.hook_name})`;
        level = 'error';
        break;
      }
      case API.BundleStatusId.COMPLETED: {
        text = 'Bundle was completed successfully';
        level = 'info';
        break;
      }
      case API.BundleStatusId.SHARED: {
        text = 'Bundle was added in share';
        level = 'info';
        break;
      }
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
      } as ReactNotification);
    }
  },
});

export default Notifications;
