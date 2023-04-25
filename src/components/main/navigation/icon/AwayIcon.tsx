import { memo } from 'react';

import { AwayEnum } from 'constants/SystemConstants';
import SystemActions from 'actions/reflux/SystemActions';
import ActivityStore from 'stores/ActivityStore';
import { useStore } from 'effects/StoreListenerEffect';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

interface State {
  away: AwayEnum;
}

const isAway = (awayState: State) => {
  return awayState.away !== AwayEnum.OFF;
};

const AwayIcon = memo(function AwayIcon() {
  const awayState = useStore<State>(ActivityStore);
  const { t } = useTranslation();

  const iconColor = isAway(awayState) ? 'yellow' : 'grey';
  return (
    <i
      className={classNames(iconColor, 'away-state link large wait icon')}
      onClick={() => SystemActions.setAway(!isAway(awayState), t)}
    />
  );
});

export default AwayIcon;
