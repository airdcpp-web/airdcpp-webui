import * as React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingPageProps } from 'routes/Settings/types';

const Entry = [
  'extensions_debug_mode',
  'extensions_auto_update',
  'extensions_init_timeout',
];

const ExtensionOptionsPage: React.FC<SettingPageProps> = () => (
  <div>
    <RemoteSettingForm keys={Entry} />
  </div>
);

export default ExtensionOptionsPage;
