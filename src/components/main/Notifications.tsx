import PropTypes from 'prop-types';
import { Component } from 'react';
import ReactDOM from 'react-dom';

//@ts-ignore
import Reflux from 'reflux';
import { default as NotificationSystem, System } from 'react-notification-system';
import { RateLimiter } from 'limiter';

import NotificationStore from 'stores/NotificationStore';

import { Location } from 'history';

import * as UI from 'types/ui';

import Logo from 'images/AirDCPlusPlus.png';
import SocketNotificationListener from './SocketNotificationListener';


type NotificationLevel = 'error' | 'warning' | 'info' | 'success';

interface NotificationsProps {
  location: Location;
}

class Notifications extends Component<NotificationsProps> {
  notifications: System | null;
  limiter = new RateLimiter(3, 3000, true);
  unsubscribe: () => void;

  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  addNotification = (level: NotificationLevel, notification: UI.Notification) => {
    (this.limiter as RateLimiter).removeTokens(1, (err, remainingTokens) => {
      // Don't spam too many notifications as that would freeze the UI
      // Always let the errors through as there shouldn't be too many of them
      if (remainingTokens < 0 && level !== 'error') {
        console.log('Notification ignored (rate limit reached)', notification);
        return;
      }

      if ('Notification' in window && Notification.permission === 'granted' && !document.hasFocus()) {
        this.showNativeNotification(level, notification);
        return;
      }
      
      // Embedded notification

      // Rate limiter uses timeouts internally so the ref may not exist anymore...
      if (!this.notifications) {
        return;
      }

      this.notifications.addNotification({
        ...notification,
        level,
        position: 'tl',
        autoDismiss: 5,
      });
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  showNativeNotification(level: NotificationLevel, notificationInfo: UI.Notification) {
    const options = {
      body: notificationInfo.message,
      icon: Logo,
      tag: notificationInfo.uid ? String(notificationInfo.uid) : undefined,
    };

    const n = new Notification(notificationInfo.title, options);
    n.onclick = () => {
      window.focus();
      if (!!notificationInfo.action && !!notificationInfo.action.callback) {
        notificationInfo.action.callback();
      }
    };

    setTimeout(n.close.bind(n), 5000);
  }

  componentDidMount() {
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    this.unsubscribe = NotificationStore.listen(this.addNotification);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { location } = this.props;
    return ReactDOM.createPortal(
      (
        <>
          <NotificationSystem 
            ref={ (c: any) => this.notifications = c }
          />
          <SocketNotificationListener location={ location }/>
        </>
      ),
      document.getElementById('notifications-node')!
    );
  }
}

export default Notifications;
