import React, { memo } from 'react';

import { AwayEnum } from 'constants/SystemConstants';
import SystemActions from 'actions/SystemActions';
import ActivityStore from 'stores/ActivityStore';
import { useStore } from 'effects/StoreListenerEffect';



const isAway = (awayState: AwayEnum) => {
  return awayState !== AwayEnum.OFF;
};

const AwayIcon = memo(() => {
  const awayState = useStore<AwayEnum>(ActivityStore);

  const iconColor = isAway(awayState) ? 'yellow' : 'grey';
  return (
    <i 
      className={ iconColor + ' away-state link large wait icon' } 
      onClick={ () => SystemActions.setAway(!isAway(awayState)) }
    />
  );
});

export default AwayIcon;