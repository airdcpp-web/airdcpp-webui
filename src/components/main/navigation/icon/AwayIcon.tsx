import { memo } from 'react';

import * as API from '@/types/api';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useSessionStoreProperty } from '@/context/SessionStoreContext';
import { ActivityAPIActions } from '@/actions/store/ActivityActions';

const isAway = (away: API.AwayEnum) => {
  return away !== API.AwayEnum.OFF;
};

const AwayIcon = memo(function AwayIcon() {
  const away = useSessionStoreProperty((state) => state.activity.away);
  const { t } = useTranslation();

  const iconColor = isAway(away) ? 'yellow' : 'grey';
  return (
    <i
      className={classNames(iconColor, 'away-state link large wait icon')}
      onClick={() => ActivityAPIActions.setAway(!isAway(away), t)}
    />
  );
});

export default AwayIcon;
