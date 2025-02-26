import * as React from 'react';

import RemoteSettingForm from '@/routes/Settings/components/RemoteSettingForm';
import { SettingPageProps } from '@/routes/Settings/types';

const Entry = ['history_search_max', 'history_download_max', 'history_chat_log_lines'];

const MessageEntry = [
  'history_hub_messages',
  'history_pm_messages',
  'history_log_messages',
];

const SessionEntry = [
  'history_hub_sessions',
  'history_pm_sessions',
  'history_filelist_sessions',
];

const HistoryPage: React.FC<SettingPageProps> = ({ moduleT }) => {
  const { t } = moduleT;
  return (
    <div>
      <RemoteSettingForm keys={Entry} />
      <RemoteSettingForm
        title={t('maxMessageHistory', 'Maximum number of messages to cache')}
        keys={MessageEntry}
      />
      <RemoteSettingForm
        title={t('maxSessionHistory', 'Maximum number of previously opened sessions')}
        keys={SessionEntry}
      />
    </div>
  );
};

export default HistoryPage;
