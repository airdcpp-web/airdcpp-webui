import * as React from 'react';

import LocalSettingForm from '@/routes/Settings/components/LocalSettingForm';
import { SettingPageProps } from '@/routes/Settings/types';
import { LocalSettings } from '@/constants/LocalSettingConstants';

const Entry = [
  LocalSettings.UNREAD_LABEL_DELAY,
  LocalSettings.BACKGROUND_IMAGE_URL,
  LocalSettings.NO_INSTALL_PROMPT,
];

const MiscellaneousPage: React.FC<SettingPageProps> = ({ moduleT }) => (
  <div>
    <LocalSettingForm moduleT={moduleT} keys={Entry} />
  </div>
);

export default MiscellaneousPage;
