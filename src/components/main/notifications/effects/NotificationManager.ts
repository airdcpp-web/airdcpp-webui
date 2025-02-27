import { useEffect, useMemo } from 'react';

import { RateLimiter } from 'limiter';

import * as UI from '@/types/ui';

import { NotificationLevel } from '../types';

export const NotificationEventEmitter = new EventTarget();

export const NOTIFICATION_EVENT_TYPE = 'ui_notification';

export type NotificationHandler = (
  level: NotificationLevel,
  notification: UI.Notification,
) => void;

export interface NotificationHandlerProps {
  showBrowserNotification: NotificationHandler;
  showNativeNotification: NotificationHandler;
}

export const useNotificationHandler = ({
  showBrowserNotification,
  showNativeNotification,
}: NotificationHandlerProps) => {
  const limiter = useMemo(
    () =>
      new RateLimiter({
        tokensPerInterval: 3,
        interval: 3000,
        fireImmediately: true,
      }),
    [],
  );

  const addNotification = async (
    level: NotificationLevel,
    notification: UI.Notification,
  ) => {
    const remainingTokens = await limiter.removeTokens(1);

    // Don't spam too many notifications as that would freeze the UI
    // Always let the errors through as there shouldn't be too many of them
    if (remainingTokens < 0 && level !== 'error') {
      console.log('Notification ignored (rate limit reached)', notification);
      return;
    }

    if (
      'Notification' in window &&
      Notification.permission === 'granted' &&
      !document.hasFocus()
    ) {
      showNativeNotification(level, notification);
      return;
    }

    // Embedded notification
    showBrowserNotification(level, notification);
  };

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    const onNotification = (event: CustomEvent) => {
      addNotification(event.detail.level, event.detail.notification);
    };

    NotificationEventEmitter.addEventListener(NOTIFICATION_EVENT_TYPE, onNotification);
    return () => {
      NotificationEventEmitter.removeEventListener(
        NOTIFICATION_EVENT_TYPE,
        onNotification,
      );
    };
  }, []);
};
