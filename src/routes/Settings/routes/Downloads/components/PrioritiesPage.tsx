import * as React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';

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

const PrioritiesPage: React.FC<SettingSectionChildProps> = (props) => {
  const { translate } = props.moduleT;
  return (
    <div>
      <RemoteSettingForm title={translate('File priorities')} {...props} keys={Entry} />
      <RemoteSettingForm
        title={translate('High priority files')}
        {...props}
        keys={HighPrioEntry}
      />
    </div>
  );
};

export default PrioritiesPage;
