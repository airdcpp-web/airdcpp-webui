import * as React from 'react';

import * as API from 'types/api';

import StatisticsIcons from 'components/main/navigation/icon/StatisticsIcons';
import LoginStore from 'stores/LoginStore';

import AwayIcon from 'components/main/navigation/icon/AwayIcon';
import RefreshProgress from './icon/RefreshProgress';
import HashProgress from './icon/HashProgress';

const IconPanel: React.FC = () => (
  <div className="icon-panel">
    <StatisticsIcons />
    <div className="touch-icons">
      <AwayIcon />
      {LoginStore.hasAccess(API.AccessEnum.SETTINGS_VIEW) && (
        <>
          <HashProgress />
          <RefreshProgress />
        </>
      )}
    </div>
  </div>
);

export default IconPanel;
