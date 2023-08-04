import HashActions from 'actions/ui/HashActions';
import ActionButton from 'components/ActionButton';
import { AdjustableSpeedLimit } from 'components/speed-limit';
import { ListItem } from 'components/semantic/List';

import * as React from 'react';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { formatSeconds, formatSize, formatSpeed } from 'utils/ValueFormat';

interface HashInfoLayoutProps {
  stats: API.HashStats;
  moduleT: UI.ModuleTranslator;
}

const getRunningStatus = (stats: API.HashStats, moduleT: UI.ModuleTranslator) => {
  if (stats.pause_forced) {
    return moduleT.translate('Paused');
  } else if (stats.hashers === 0) {
    return moduleT.translate('Idle');
  }

  return moduleT.t('runningThreads', {
    defaultValue: 'Running ({{threadCount}} threads)',
    replace: {
      threadCount: stats.hashers,
    },
  });
};

export const HashInfoLayout: React.FC<HashInfoLayoutProps> = ({ stats, moduleT }) => {
  const itemData = {
    id: 'stats',
    ...stats,
  };

  return (
    <div className="hash-layout">
      <div className="ui list">
        <ListItem
          header={moduleT.translate('Status')}
          description={getRunningStatus(stats, moduleT)}
        />
        {stats.hash_files_left > 0 && (
          <ListItem
            header={moduleT.translate('Files left')}
            description={`${stats.hash_files_left} (${formatSize(
              stats.hash_bytes_left,
              moduleT.plainT,
            )})`}
          />
        )}
        {stats.hashers > 0 && stats.hash_speed > 0 && (
          <>
            <ListItem
              header={moduleT.translate('Speed')}
              description={formatSpeed(stats.hash_speed, moduleT.plainT)}
            />
            <ListItem
              header={moduleT.translate('Time left')}
              description={formatSeconds(stats.hash_bytes_left / stats.hash_speed)}
            />
          </>
        )}
        <ListItem
          header={moduleT.translate('Maximum speed per hasher')}
          description={
            <AdjustableSpeedLimit
              limit={stats.max_hash_speed}
              settingKey={'max_hash_speed'}
              unit="MiB"
            />
          }
        />
      </div>
      <ActionButton
        actions={HashActions}
        actionId="pause"
        itemData={itemData}
        loading={stats.pause_forced && stats.hashers > 0}
      />
      <ActionButton actions={HashActions} actionId="resume" itemData={itemData} />
      <ActionButton
        actions={HashActions}
        actionId="stop"
        itemData={itemData}
        loading={stats.hash_bytes_left === 0 && stats.hashers > 0}
      />
    </div>
  );
};
