import React from 'react';

import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';


const Entry = [
  'history_search_max',
  'history_download_max',
  'history_chat_log_lines',
];

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

const HistoryPage = props => (
  <div>
    <RemoteSettingForm
      //title="Miscellaneous"
      { ...props }
      keys={ Entry }
    />
    <RemoteSettingForm
      title="Maximum number of messages to cache"
      { ...props }
      keys={ MessageEntry }
    />
    <RemoteSettingForm
      title="Maximum number of previously opened sessions"
      { ...props }
      keys={ SessionEntry }
    />
  </div>
);

export default HistoryPage;