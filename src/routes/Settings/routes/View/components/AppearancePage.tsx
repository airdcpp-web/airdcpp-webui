import * as React from 'react';

import RemoteSettingForm from '@/routes/Settings/components/RemoteSettingForm';
import { SettingPageProps } from '@/routes/Settings/types';

const Entry = ['use_main_chat_notify', 'show_joins', 'format_release_names'];

const GeneralPage: React.FC<SettingPageProps> = () => (
  <div>
    <RemoteSettingForm keys={Entry} />
  </div>
);

export default GeneralPage;
