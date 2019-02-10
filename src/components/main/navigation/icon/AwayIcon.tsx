import React, { memo } from 'react';

import { AwayEnum } from 'constants/SystemConstants';
import SystemActions from 'actions/SystemActions';
import ActivityStore from 'stores/ActivityStore';
import { useStore } from 'effects/StoreListenerEffect';


interface State {
  away: AwayEnum;
}

const isAway = (awayState: State) => {
  return awayState.away !== AwayEnum.OFF;
};

const AwayIcon = memo(() => {
  const awayState = useStore<State>(ActivityStore);

  const iconColor = isAway(awayState) ? 'yellow' : 'grey';
  return (
    <i 
      className={ iconColor + ' away-state link large wait icon' } 
      onClick={ () => SystemActions.actions.setAway(!isAway(awayState)) }
    />
  );
});

export default AwayIcon;