import * as React from 'react';

import AutoValuePanel from '@/routes/Settings/routes/SpeedLimits/components/AutoValuePanel';
import { SettingPageProps } from '@/routes/Settings/types';

const Auto = ['mcn_auto_limits', 'mcn_down', 'mcn_up'];

const UserLimitPage: React.FC<SettingPageProps> = () => (
  <div>
    <AutoValuePanel keys={Auto} type="mcn" />
  </div>
);

export default UserLimitPage;
