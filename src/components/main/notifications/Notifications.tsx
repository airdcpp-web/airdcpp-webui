import ReactDOM from 'react-dom';

import { ToastContainer, toast } from 'react-toastify';

import SocketNotificationListener from './SocketNotificationListener';
import { NotificationMessage } from './NotificationMessage';

import Logo from '../../../../resources/images/AirDCPlusPlus.png';

import {
  NotificationHandler,
  useNotificationHandler,
} from './effects/NotificationManager';

interface NotificationsProps {}

const showBrowserNotification: NotificationHandler = (level, notification) => {
  toast(<NotificationMessage notification={notification} level={level} />, {
    // Disable for now as old notifications won't be replaced with newer one
    // toastId: notification.uid,
    type: level,
    position: 'top-left',
    autoClose: 5000,
    closeOnClick: true,
    icon: false,
  });
};

const showNativeNotification: NotificationHandler = (level, notificationInfo) => {
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
};

const Notifications: React.FC<NotificationsProps> = (props) => {
  useNotificationHandler({
    showBrowserNotification,
    showNativeNotification,
  });

  return ReactDOM.createPortal(
    <>
      <ToastContainer limit={3} hideProgressBar={true} pauseOnFocusLoss={false} />
      <SocketNotificationListener />
    </>,
    document.getElementById('notifications-node')!,
  );
};

export default Notifications;
