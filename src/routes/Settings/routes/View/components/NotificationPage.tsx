import * as React from 'react';

import { LocalSettings } from '@/constants/SettingConstants';
import LocalSettingForm from '@/routes/Settings/components/LocalSettingForm';

import '../style.css';
import { SettingPageProps } from '@/routes/Settings/types';

const PopupEntry = [
  LocalSettings.NOTIFY_MENTION,
  LocalSettings.NOTIFY_PM_USER,
  LocalSettings.NOTIFY_PM_BOT,
  LocalSettings.NOTIFY_HUB_MESSAGE,

  LocalSettings.NOTIFY_BUNDLE_STATUS,

  LocalSettings.NOTIFY_EVENTS_INFO,
  LocalSettings.NOTIFY_EVENTS_WARNING,
  LocalSettings.NOTIFY_EVENTS_ERROR,
];

const NotificationPage: React.FC<SettingPageProps> = ({ moduleT }) => {
  const { translate } = moduleT;
  return (
    <div>
      <LocalSettingForm
        title={translate('Popup notifications')}
        moduleT={moduleT}
        keys={PopupEntry}
      />
    </div>
  );
};

export default NotificationPage;
