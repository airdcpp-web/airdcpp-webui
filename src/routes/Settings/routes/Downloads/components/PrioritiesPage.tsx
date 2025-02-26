import * as React from 'react';
import RemoteSettingForm from '@/routes/Settings/components/RemoteSettingForm';
import { SettingPageProps } from '@/routes/Settings/types';

const Entry = [
  'prio_highest_size',
  'prio_high_size',
  'prio_normal_size',
  'prio_auto_default',
];

const HighPrioEntry = [
  'prio_high_files_to_highest',
  'prio_high_files',
  'prio_high_files_regex',
];

const PrioritiesPage: React.FC<SettingPageProps> = ({ moduleT }) => {
  const { translate } = moduleT;
  return (
    <div>
      <RemoteSettingForm title={translate('File priorities')} keys={Entry} />
      <RemoteSettingForm title={translate('High priority files')} keys={HighPrioEntry} />
    </div>
  );
};

export default PrioritiesPage;
