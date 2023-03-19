import * as React from 'react';

import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';

const Entry = ['use_main_chat_notify', 'show_joins', 'format_release_names'];

const GeneralPage: React.FC<SettingSectionChildProps> = (props) => (
  <div>
    <RemoteSettingForm {...props} keys={Entry} />
  </div>
);

export default GeneralPage;
