import React from 'react';

import { LocalSettings } from 'constants/SettingConstants';
import LocalSettingForm from 'routes/Settings/components/LocalSettingForm';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';


const Entry = [
  LocalSettings.UNREAD_LABEL_DELAY,
  LocalSettings.BACKGROUND_IMAGE_URL,
];

const MiscellaneousPage: React.FC<SettingSectionChildProps> = props => (
  <div>
    <LocalSettingForm
      { ...props }
      keys={ Entry }
    />
  </div>
);

export default MiscellaneousPage;