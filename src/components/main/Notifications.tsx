import PropTypes from 'prop-types';
import { Component } from 'react';
import ReactDOM from 'react-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RateLimiter } from 'limiter';

import NotificationStore from 'stores/NotificationStore';

import { Location } from 'history';

import * as UI from 'types/ui';

import Logo from 'images/AirDCPlusPlus.png';
import SocketNotificationListener from './SocketNotificationListener';
import Button from 'components/semantic/Button';
import classNames from 'classnames';


type NotificationLevel = 'error' | 'warning' | 'info' | 'success';

interface NotificationsProps {
  location: Location;
}

const getSeverityColor = (severity: NotificationLevel) => {
  switch (severity) {
    case 'info': return 'blue';
    case 'warning': return 'yellow';
    case 'error': return 'red';
    case 'success': return 'green';
    default: return '';
  }
}

interface NotificationMessageProps {
  notification: UI.Notification;
  level: NotificationLevel;
}

const NotificationMessage = ({ notification, level }: NotificationMessageProps) => {
  const { title, message, action } = notification;
  const color = getSeverityColor(level);
  return (
    <>
      <div className="content">
        <div className={ classNames('ui tiny header', color) } style={{margin: '0px'}}>
          {title}
        </div>
        <div>
          {message}
        </div>
      </div>
      {!!action && (
        <Button
          caption={action.label}
          onClick={action.callback}
          className="primary"
          style={{
            marginTop: '10px'
          }}
          color={color}
        />
      )}
    </>
  )
}

class Notifications extends Component<NotificationsProps> {
  limiter = new RateLimiter({
    tokensPerInterval: 3,
    interval: 3000,
    fireImmediately: true,
  });
  
  unsubscribe: () => void;

  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  addNotification = async (level: NotificationLevel, notification: UI.Notification) => {
    const remainingTokens = await this.limiter.removeTokens(1);

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
    toast(<NotificationMessage notification={notification} level={level}/>, {
      // Disable for now as old notifications won't be replaced with newer one
      // toastId: notification.uid,
      type: level,
      position: 'top-left',
      autoClose: 5000,
      icon: false,
    })
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
          <ToastContainer limit={3} hideProgressBar={true} pauseOnFocusLoss={false}/>
          <SocketNotificationListener location={ location }/>
        </>
      ),
      document.getElementById('notifications-node')!
    );
  }
}

export default Notifications;
