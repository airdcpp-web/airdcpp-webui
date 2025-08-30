import { memo } from 'react';

import * as API from '@/types/api';

import { useTranslation } from 'react-i18next';

import { useSessionStoreProperty } from '@/context/SessionStoreContext';
import { ActivityAPIActions } from '@/actions/store/ActivityActions';
import { useSocket } from '@/context/SocketContext';
import Icon from '@/components/semantic/Icon';

const isAway = (away: API.AwayEnum) => {
  return away !== API.AwayEnum.OFF;
};

const AwayIcon = memo(function AwayIcon() {
  const away = useSessionStoreProperty((state) => state.activity.away);
  const { t } = useTranslation();
  const socket = useSocket();

  const iconColor = isAway(away) ? 'yellow' : 'grey';
  return (
    <Icon
      icon="wait"
      className="away-state"
      color={iconColor}
      size="large"
      onClick={() => ActivityAPIActions.setAway(!isAway(away), socket, t)}
      title={isAway(away) ? 'Away mode enabled' : 'Away mode disabled'}
    />
  );
});

export default AwayIcon;
