import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import PrivateChatConstants from 'constants/PrivateChatConstants';
import ViewFileConstants from 'constants/ViewFileConstants';
import { default as QueueConstants } from 'constants/QueueConstants';
import { default as EventConstants } from 'constants/EventConstants';

import NotificationActions from 'actions/NotificationActions';

import LocalSettingStore from 'stores/reflux/LocalSettingStore';
import { LocalSettings } from 'constants/SettingConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

import Severity = API.SeverityEnum;
import {
  SocketSubscriptionDecorator,
  SocketSubscriptionDecoratorChildProps,
} from 'decorators/SocketSubscriptionDecorator';
import { translate, toI18nKey } from 'utils/TranslationUtils';
import HubConstants from 'constants/HubConstants';

import { useAppStore } from 'context/StoreContext';

const getSeverityStr = (severity: Severity) => {
  switch (severity) {
    case Severity.NOTIFY:
      return 'Information';
    case Severity.VERBOSE:
      return 'VERBOSE';
    case Severity.INFO:
      return 'INFO';
    case Severity.ERROR:
      return 'ERROR';
    case Severity.WARNING:
      return 'WARNING';
    default:
      return '';
  }
};

const notifyHubMessage = (message: API.ChatMessage, store: UI.Store) => {
  if (message.has_mention && LocalSettingStore.getValue(LocalSettings.NOTIFY_MENTION)) {
    return true;
  }

  if (LocalSettingStore.getValue(LocalSettings.NOTIFY_HUB_MESSAGE)) {
    const sessionId = message.from.hub_session_id;
    const session = store.hubs.getSession(sessionId);
    if (session && session.settings.use_main_chat_notify) {
      return true;
    }
  }

  return false;
};

const notifyPrivateMessage = (message: API.ChatMessage) => {
  if (message.has_mention && LocalSettingStore.getValue(LocalSettings.NOTIFY_MENTION)) {
    return true;
  }

  if (message.reply_to!.flags.includes('bot')) {
    if (LocalSettingStore.getValue(LocalSettings.NOTIFY_PM_BOT)) {
      return true;
    }
  } else if (LocalSettingStore.getValue(LocalSettings.NOTIFY_PM_USER)) {
    return true;
  }

  return false;
};

interface SocketNotificationListenerProps {}

type Props = SocketNotificationListenerProps & SocketSubscriptionDecoratorChildProps;

const SocketNotificationListener: React.FC<Props> = ({ addSocketListener }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const store = useAppStore();

  const translateNotification = (
    text: string,
    moduleId: UI.Modules,
    isAction = false,
  ) => {
    const moduleIds = [moduleId, UI.SubNamespaces.NOTIFICATIONS];
    if (isAction) {
      moduleIds.push(UI.SubNamespaces.ACTIONS);
    }

    return translate(text, t, moduleIds);
  };

  const onLogMessage = (message: API.StatusMessage) => {
    const { text, severity } = message;

    const notification: UI.Notification = {
      title: translateNotification(getSeverityStr(severity), UI.Modules.EVENTS),
      message: text,
      action:
        severity === Severity.NOTIFY
          ? undefined
          : {
              label: translateNotification('View events', UI.Modules.EVENTS, true),
              callback: () => {
                navigate('/events');
              },
            },
    };

    if (severity === Severity.NOTIFY) {
      NotificationActions.info(notification);
    } else if (
      severity === Severity.INFO &&
      LocalSettingStore.getValue(LocalSettings.NOTIFY_EVENTS_INFO)
    ) {
      NotificationActions.info(notification);
    } else if (
      severity === Severity.WARNING &&
      LocalSettingStore.getValue(LocalSettings.NOTIFY_EVENTS_WARNING)
    ) {
      NotificationActions.warning(notification);
    } else if (
      severity === Severity.ERROR &&
      LocalSettingStore.getValue(LocalSettings.NOTIFY_EVENTS_ERROR)
    ) {
      NotificationActions.error(notification);
    }
  };

  const onViewFileDownloaded = (file: API.ViewFile) => {
    if (!file.content_ready) {
      return;
    }

    const message = file.download_state
      ? 'File has finished downloading'
      : 'File was loaded';
    NotificationActions.info({
      title: file.name,
      message: translateNotification(message, UI.Modules.VIEWED_FILES),
      uid: `view_file_${file.id}`,
      action: {
        label: translateNotification('View file', UI.Modules.VIEWED_FILES, true),
        callback: () => {
          navigate(`/files/session/${file.id}`);
        },
      },
    } as UI.Notification);
  };

  const onHubMessage = (message: API.ChatMessage) => {
    const hubId = message.from.hub_session_id;
    if (
      message.is_read ||
      (store.hubs.activeSessionId === hubId && document.hasFocus())
    ) {
      return;
    }

    if (!notifyHubMessage(message, store)) {
      return;
    }

    NotificationActions.info({
      title: message.from.nick,
      message: message.text,
      uid: undefined,
      action: {
        label: translateNotification('View chat', UI.Modules.HUBS, true),
        callback: () => {
          navigate(`/hubs/session/${hubId}`);
        },
      },
    } as UI.Notification);
  };

  const onPrivateMessage = (message: API.ChatMessage) => {
    const cid = message.reply_to!.cid;
    if (
      message.is_read ||
      (store.privateChats.activeSessionId === cid && document.hasFocus())
    ) {
      return;
    }

    if (!notifyPrivateMessage(message)) {
      return;
    }

    NotificationActions.info({
      title: message.from.nick,
      message: message.text,
      uid: cid,
      action: {
        label: translateNotification('View message', UI.Modules.MESSAGES, true),
        callback: () => {
          navigate(`/messages/session/${cid}`);
        },
      },
    } as UI.Notification);
  };

  const onBundleStatus = (bundle: API.QueueBundle) => {
    if (!LocalSettingStore.getValue(LocalSettings.NOTIFY_BUNDLE_STATUS)) {
      return;
    }

    let text;
    let level: 'info' | 'error' | undefined;
    switch (bundle.status.id) {
      case API.QueueBundleStatusEnum.QUEUED: {
        text = translateNotification('Bundle was added in queue', UI.Modules.QUEUE);
        level = 'info';
        break;
      }
      case API.QueueBundleStatusEnum.DOWNLOAD_ERROR: {
        text = t(
          toI18nKey('bundleDownloadError', [
            UI.Modules.QUEUE,
            UI.SubNamespaces.NOTIFICATIONS,
          ]),
          {
            defaultValue: 'Download error: {{error}}',
            replace: {
              error: bundle.status.str,
            },
          },
        );
        level = 'error';
        break;
      }
      case API.QueueBundleStatusEnum.COMPLETION_VALIDATION_RUNNING: {
        text = translateNotification('Validating downloaded bundle', UI.Modules.QUEUE);
        level = 'info';
        break;
      }
      case API.QueueBundleStatusEnum.COMPLETION_VALIDATION_ERROR: {
        const { hook_name, str } = bundle.status.hook_error;
        text = t(
          toI18nKey('bundleContentValidationError', [
            UI.Modules.QUEUE,
            UI.SubNamespaces.NOTIFICATIONS,
          ]),
          {
            defaultValue: 'Bundle content validation failed: {{error}} ({{hook}})',
            replace: {
              error: str,
              hook: hook_name,
            },
          },
        );
        level = 'error';
        break;
      }
      case API.QueueBundleStatusEnum.COMPLETED: {
        text = translateNotification(
          'Bundle was completed successfully',
          UI.Modules.QUEUE,
        );
        level = 'info';
        break;
      }
      case API.QueueBundleStatusEnum.SHARED: {
        text = translateNotification('Bundle was added in share', UI.Modules.QUEUE);
        level = 'info';
        break;
      }
      default:
    }

    if (level) {
      const action =
        level === 'info' ? NotificationActions.info : NotificationActions.error;
      action({
        title: bundle.name,
        message: text,
        uid: `queue_bundle_${bundle.id}`,
        action: {
          label: translateNotification('View queue', UI.Modules.QUEUE, true),
          callback: () => {
            navigate('/queue');
          },
        },
      } as UI.Notification);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line max-len
    addSocketListener(
      PrivateChatConstants.MODULE_URL,
      PrivateChatConstants.MESSAGE,
      onPrivateMessage,
      undefined,
      API.AccessEnum.PRIVATE_CHAT_VIEW,
    );

    // eslint-disable-next-line max-len
    addSocketListener(
      HubConstants.MODULE_URL,
      HubConstants.HUB_MESSAGE,
      onHubMessage,
      undefined,
      API.AccessEnum.HUBS_VIEW,
    );

    // eslint-disable-next-line max-len
    addSocketListener(
      QueueConstants.MODULE_URL,
      QueueConstants.BUNDLE_ADDED,
      onBundleStatus,
      undefined,
      API.AccessEnum.QUEUE_VIEW,
    );
    // eslint-disable-next-line max-len
    addSocketListener(
      QueueConstants.MODULE_URL,
      QueueConstants.BUNDLE_STATUS,
      onBundleStatus,
      undefined,
      API.AccessEnum.QUEUE_VIEW,
    );

    // eslint-disable-next-line max-len
    addSocketListener(
      EventConstants.MODULE_URL,
      EventConstants.MESSAGE,
      onLogMessage,
      undefined,
      API.AccessEnum.EVENTS_VIEW,
    );
    // eslint-disable-next-line max-len
    addSocketListener(
      ViewFileConstants.MODULE_URL,
      ViewFileConstants.FILE_DOWNLOADED,
      onViewFileDownloaded,
      undefined,
      API.AccessEnum.VIEW_FILE_VIEW,
    );
  }, []);

  return null;
};

export default SocketSubscriptionDecorator<SocketNotificationListenerProps>(
  SocketNotificationListener,
);
