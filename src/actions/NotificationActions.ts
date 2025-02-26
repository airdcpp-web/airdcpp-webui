//@ts-ignore
import Reflux from 'reflux';

import * as UI from '@/types/ui';

const NotificationActionConfig: UI.RefluxActionConfigList<UI.Notification> = [
  'success',
  'info',
  'warning',
  'error',
  'apiError',
];

const NotificationActions = Reflux.createActions(NotificationActionConfig);

export default NotificationActions as UI.RefluxActionListType<UI.Notification>;
