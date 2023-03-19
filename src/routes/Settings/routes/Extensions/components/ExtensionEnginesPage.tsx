import * as React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';

const Entry = ['extension_engines'];

const ExtensionEnginesPage: React.FC<SettingSectionChildProps> = (props) => (
  <div>
    <RemoteSettingForm {...props} keys={Entry} />
  </div>
);

export default ExtensionEnginesPage;
