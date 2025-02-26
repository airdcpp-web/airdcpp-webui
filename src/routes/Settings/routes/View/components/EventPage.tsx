import * as React from 'react';

import RemoteSettingForm from '@/routes/Settings/components/RemoteSettingForm';
import { SettingPageProps } from '@/routes/Settings/types';

const Entry = [
  'report_uploads',
  'report_downloads',
  'report_search_alternates',
  'report_added_sources',
  'report_blocked_share',
  'report_hashed_files',
  'report_scheduled_refreshes',
  'report_filelist_dupes',
];

const EventPage: React.FC<SettingPageProps> = () => (
  <div>
    <RemoteSettingForm keys={Entry} />
  </div>
);

export default EventPage;
