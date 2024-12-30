import * as React from 'react';

import * as API from 'types/api';

import HashStatistics from 'components/main/navigation/statistic-items/HashStatistics';

import AwayIcon from 'components/main/navigation/icon/AwayIcon';
import RefreshProgress from './icon/RefreshProgress';
import HashProgress from './icon/HashProgress';
import { useSession } from 'context/SessionContext';
import TransferStatistics from './statistic-items/TransferStatistics';

const IconPanel: React.FC = () => {
  const { hasAccess } = useSession();
  const hasHashAccess = hasAccess(API.AccessEnum.SETTINGS_VIEW);
  const hasTransferAccess = hasAccess(API.AccessEnum.TRANSFERS);
  return (
    <div className="icon-panel">
      <div className="ui centered inverted mini list statistics-icons">
        {hasTransferAccess && <TransferStatistics />}
        {hasHashAccess && <HashStatistics />}
      </div>
      <div className="touch-icons">
        <AwayIcon />
        {hasHashAccess && (
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
