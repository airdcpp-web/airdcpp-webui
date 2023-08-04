import * as React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingPageProps } from 'routes/Settings/types';

const Entry = [
  'auto_add_sources',
  'alt_search_auto',
  'alt_search_max_sources',
  'max_sources_match_queue',
  'allow_match_full_list',
];

const SearchMatchingPage: React.FC<SettingPageProps> = () => (
  <div>
    <RemoteSettingForm keys={Entry} />
  </div>
);

export default SearchMatchingPage;
