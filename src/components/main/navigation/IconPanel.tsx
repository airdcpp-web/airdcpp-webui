import * as React from 'react';

import * as API from 'types/api';

import StatisticsIcons from 'components/main/navigation/icon/StatisticsIcons';

import AwayIcon from 'components/main/navigation/icon/AwayIcon';
import RefreshProgress from './icon/RefreshProgress';
import HashProgress from './icon/HashProgress';
import { useSession } from 'context/SessionContext';

const IconPanel: React.FC = () => {
  const { hasAccess } = useSession();
  return (
    <div className="icon-panel">
      <StatisticsIcons />
      <div className="touch-icons">
        <AwayIcon />
        {hasAccess(API.AccessEnum.SETTINGS_VIEW) && (
          <>
            <HashProgress />
            <RefreshProgress />
          </>
        )}
      </div>
    </div>
  );
};

export default IconPanel;
