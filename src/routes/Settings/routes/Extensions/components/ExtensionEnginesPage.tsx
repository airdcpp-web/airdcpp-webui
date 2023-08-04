import * as React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingPageProps } from 'routes/Settings/types';

const Entry = ['extension_engines'];

const ExtensionEnginesPage: React.FC<SettingPageProps> = () => (
  <div>
    <RemoteSettingForm keys={Entry} />
  </div>
);

export default ExtensionEnginesPage;
