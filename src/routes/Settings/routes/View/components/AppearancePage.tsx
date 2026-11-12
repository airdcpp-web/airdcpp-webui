import * as React from 'react';

import RemoteSettingForm from '@/routes/Settings/components/RemoteSettingForm';
import LocalSettingForm from '@/routes/Settings/components/LocalSettingForm';
import { LocalSettings } from '@/constants/LocalSettingConstants';
import { SettingPageProps } from '@/routes/Settings/types';

import '../style.css';

const Entry = ['use_main_chat_notify', 'show_joins', 'format_release_names'];

const GeneralPage: React.FC<SettingPageProps> = ({ moduleT }) => (
  <div>
    <LocalSettingForm keys={[LocalSettings.DARK_MODE]} moduleT={moduleT} />
    <RemoteSettingForm keys={Entry} />
  </div>
);

export default GeneralPage;
