import * as React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';

const Entry = [
  'extensions_debug_mode',
  'extensions_auto_update',
  'extensions_init_timeout',
];

const ExtensionOptionsPage: React.FC<SettingSectionChildProps> = (props) => (
  <div>
    <RemoteSettingForm {...props} keys={Entry} />
  </div>
);

export default ExtensionOptionsPage;
