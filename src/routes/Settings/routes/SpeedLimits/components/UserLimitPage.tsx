import React from 'react';

import AutoValuePanel from 'routes/Settings/routes/SpeedLimits/components/AutoValuePanel';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';


const Auto = [
  'mcn_auto_limits',
  'mcn_down',
  'mcn_up',
];

const UserLimitPage: React.SFC<SettingSectionChildProps> = props => (
  <div>
    <AutoValuePanel
      { ...props }
      keys={ Auto }
      type="mcn"
    />
  </div>
);

export default UserLimitPage;