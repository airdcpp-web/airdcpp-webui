import * as UI from '@/types/ui';

import { NotificationLevel } from '@/components/main/notifications/types';
import { ErrorResponse } from 'airdcpp-apisocket';
import { errorResponseToString } from '@/utils/TypeConvert';
import {
  NOTIFICATION_EVENT_TYPE,
  NotificationEventEmitter,
} from '@/components/main/notifications/effects/NotificationManager';

const createNotificationHandler = (level: NotificationLevel) => {
  return (notification: UI.Notification) => {
    // console.log('Notification handler', notification);
    NotificationEventEmitter.dispatchEvent(
      new CustomEvent(NOTIFICATION_EVENT_TYPE, { detail: { level, notification } }),
    );
  };
};

const NotificationActions = {
  success: createNotificationHandler('success'),
  info: createNotificationHandler('info'),
  warning: createNotificationHandler('warning'),
  error: createNotificationHandler('error'),
  apiError: (title: string, error: Error | ErrorResponse, ...args: any[]) => {
    // console.error('API error', error, ...args);

    NotificationActions.error({
      title,
      message: errorResponseToString(error),
    });
  },
};

export default NotificationActions;
