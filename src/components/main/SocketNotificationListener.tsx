import { Component } from 'react';

import PrivateChatConstants from 'constants/PrivateChatConstants';
import ViewFileConstants from 'constants/ViewFileConstants';
import { default as QueueConstants } from 'constants/QueueConstants';
import { default as EventConstants } from 'constants/EventConstants';

import NotificationActions from 'actions/NotificationActions';

import History from 'utils/History';

import LocalSettingStore from 'stores/LocalSettingStore';
import { LocalSettings } from 'constants/SettingConstants';

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';

import { Location } from 'history';

import * as API from 'types/api';
import * as UI from 'types/ui';

import Severity = API.SeverityEnum;
import { 
  SocketSubscriptionDecorator, SocketSubscriptionDecoratorChildProps
} from 'decorators/SocketSubscriptionDecorator';
import { withTranslation, WithTranslation } from 'react-i18next';
import { translate, toI18nKey } from 'utils/TranslationUtils';
import HubConstants from 'constants/HubConstants';
import HubSessionStore from 'stores/HubSessionStore';


const getSeverityStr = (severity: Severity) => {
  switch (severity) {
    case Severity.NOTIFY: return 'Information';
    case Severity.INFO: return 'INFO';
    case Severity.ERROR: return 'ERROR';
    case Severity.WARNING: return 'WARNING';
    default: return '';
  }
};

const notifyHubMessage = (message: API.ChatMessage) => {
  if (message.has_mention && LocalSettingStore.getValue(LocalSettings.NOTIFY_MENTION)) {
    return true;
  }

  if (LocalSettingStore.getValue(LocalSettings.NOTIFY_HUB_MESSAGE)) {
    const sessionId = message.from.hub_session_id;
    const session: API.Hub | null = HubSessionStore.getSession(sessionId);
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

  if (message.reply_to!.flags.indexOf('bot') > -1) {
    if (LocalSettingStore.getValue(LocalSettings.NOTIFY_PM_BOT)) {
      return true;
    }
  } else if (LocalSettingStore.getValue(LocalSettings.NOTIFY_PM_USER)) {
    return true;
  }

  return false;
};

interface SocketNotificationListenerProps {
  location: Location;
}

type Props = SocketNotificationListenerProps & SocketSubscriptionDecoratorChildProps & WithTranslation;

class SocketNotificationListener extends Component<Props> {
  //notifications: System | null;
  //limiter = new RateLimiter(3, 3000, true);
  //unsubscribe: () => void;

  //static propTypes = {
  //  location: PropTypes.object.isRequired,
  //};

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.onSocketConnected();
  }

  onSocketConnected() {
    const { addSocketListener } = this.props;

    // tslint:disable-next-line:max-line-length
    addSocketListener(PrivateChatConstants.MODULE_URL, PrivateChatConstants.MESSAGE, this.onPrivateMessage, undefined, API.AccessEnum.PRIVATE_CHAT_VIEW);

    // tslint:disable-next-line:max-line-length
    addSocketListener(HubConstants.MODULE_URL, HubConstants.HUB_MESSAGE, this.onHubMessage, undefined, API.AccessEnum.HUBS_VIEW);

    // tslint:disable-next-line:max-line-length
    addSocketListener(QueueConstants.MODULE_URL, QueueConstants.BUNDLE_ADDED, this.onBundleStatus, undefined, API.AccessEnum.QUEUE_VIEW);
    // tslint:disable-next-line:max-line-length
    addSocketListener(QueueConstants.MODULE_URL, QueueConstants.BUNDLE_STATUS, this.onBundleStatus, undefined, API.AccessEnum.QUEUE_VIEW);

    // tslint:disable-next-line:max-line-length
    addSocketListener(EventConstants.MODULE_URL, EventConstants.MESSAGE, this.onLogMessage, undefined, API.AccessEnum.EVENTS_VIEW);
    // tslint:disable-next-line:max-line-length
    addSocketListener(ViewFileConstants.MODULE_URL, ViewFileConstants.FILE_DOWNLOADED, this.onViewFileDownloaded, undefined, API.AccessEnum.VIEW_FILE_VIEW);
  }

  onLogMessage = (message: API.StatusMessage) => {
    const { text, id, severity } = message;

    const notification: UI.Notification = {
      title: this.translate(getSeverityStr(severity), UI.Modules.EVENTS),
      message: text,
      uid: id,
      action: severity === Severity.NOTIFY ? undefined : {
        label: this.translate('View events', UI.Modules.EVENTS, true),
        callback: () => { 
          History.push('/events'); 
        }
      }
    };

    if (severity === Severity.NOTIFY) {
      NotificationActions.info(notification);
    } else if (severity === Severity.INFO && LocalSettingStore.getValue(LocalSettings.NOTIFY_EVENTS_INFO)) {
      NotificationActions.info(notification);
    } else if (severity === Severity.WARNING && LocalSettingStore.getValue(LocalSettings.NOTIFY_EVENTS_WARNING)) {
      NotificationActions.warning(notification);
    } else if (severity === Severity.ERROR && LocalSettingStore.getValue(LocalSettings.NOTIFY_EVENTS_ERROR)) {
      NotificationActions.error(notification);
    }
  }

  onViewFileDownloaded = (file: API.ViewFile) => {
    if (!file.content_ready) {
      return;
    }

    NotificationActions.info({
      title: file.name,
      message: this.translate('File has finished downloading', UI.Modules.VIEWED_FILES),
      uid: file.id,
      action: {
        label: this.translate('View file', UI.Modules.VIEWED_FILES, true),
        callback: () => {
          History.push(`/files/session/${file.id}`);
        }
      }
    } as UI.Notification);
  }
  
  onHubMessage = (message: API.ChatMessage) => {
    const hubId = message.from.hub_session_id;
    if (message.is_read || (HubSessionStore.getActiveSessionId() === hubId && document.hasFocus())) {
      return;
    }

    if (!notifyHubMessage(message)) {
      return;
    }

    NotificationActions.info({
      title: message.from.nick,
      message: message.text,
      uid: undefined,
      action: {
        label: this.translate('View chat', UI.Modules.HUBS, true),
        callback: () => { 
          History.push(`/hubs/session/${hubId}`); 
        }
      }
    } as UI.Notification);
  }

  onPrivateMessage = (message: API.ChatMessage) => {
    const cid = message.reply_to!.cid;
    if (message.is_read || (PrivateChatSessionStore.getActiveSessionId() === cid && document.hasFocus())) {
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
        label: this.translate('View message', UI.Modules.MESSAGES, true),
        callback: () => { 
          History.push(`/messages/session/${cid}`); 
        }
      }
    } as UI.Notification);
  }

  translate = (text: string, moduleId: UI.Modules, isAction: boolean = false) => {
    const moduleIds = [ moduleId, UI.SubNamespaces.NOTIFICATIONS ];
    if (isAction) {
      moduleIds.push(UI.SubNamespaces.ACTIONS);
    }

    const { t } = this.props;
    return translate(text, t, moduleIds);
  }

  onBundleStatus = (bundle: API.QueueBundle) => {
    if (!LocalSettingStore.getValue(LocalSettings.NOTIFY_BUNDLE_STATUS)) {
      return;
    }

    let text;
    let level: 'info' | 'error' | undefined;
    const { t } = this.props;
    switch (bundle.status.id) {
      case API.QueueBundleStatusEnum.QUEUED: {
        text = this.translate('Bundle was added in queue', UI.Modules.QUEUE);
        level = 'info';
        break;
      }
      case API.QueueBundleStatusEnum.DOWNLOAD_ERROR: {
        text = t(
          toI18nKey('bundleDownloadError', [ UI.Modules.QUEUE, UI.SubNamespaces.NOTIFICATIONS ]),
          {
            defaultValue: 'Download error: {{error}}',
            replace: {
              error: bundle.status.str,
            }
          }
        );
        level = 'error';
        break;
      }
      case API.QueueBundleStatusEnum.COMPLETION_VALIDATION_RUNNING: {
        text = this.translate('Validating downloaded bundle', UI.Modules.QUEUE);
        level = 'info';
        break;
      }
      case API.QueueBundleStatusEnum.COMPLETION_VALIDATION_ERROR: {
        const { hook_name, str } = bundle.status.hook_error;
        text = t(
          toI18nKey('bundleContentValidationError', [ UI.Modules.QUEUE, UI.SubNamespaces.NOTIFICATIONS ]),
          {
            defaultValue: 'Bundle content validation failed: {{error}} ({{hook}})',
            replace: {
              error: str,
              hook: hook_name,
            }
          }
        );
        level = 'error';
        break;
      }
      case API.QueueBundleStatusEnum.COMPLETED: {
        text = this.translate('Bundle was completed successfully', UI.Modules.QUEUE);
        level = 'info';
        break;
      }
      case API.QueueBundleStatusEnum.SHARED: {
        text = this.translate('Bundle was added in share', UI.Modules.QUEUE);
        level = 'info';
        break;
      }
      default:
    }

    if (level) {
      const action = level === 'info' ? NotificationActions.info : NotificationActions.error;
      action({
        title: bundle.name,
        message: text,
        action: {
          label: this.translate('View queue', UI.Modules.QUEUE, true),
          callback: () => { 
            History.push('/queue'); 
          }
        }
      } as UI.Notification);
    }
  }

  render() {
    return null;
  }
}

export default SocketSubscriptionDecorator<SocketNotificationListenerProps>(
  withTranslation()(SocketNotificationListener)
);
