import React from 'react';
import createReactClass from 'create-react-class';
//@ts-ignore
import Reflux from 'reflux';

import { AwayEnum } from 'constants/SystemConstants';
import SystemActions from 'actions/SystemActions';
import ActivityStore from 'stores/ActivityStore';


const AwayIcon = createReactClass({
  displayName: 'AwayIcon',
  mixins: [ Reflux.connect(ActivityStore, 'activityState') ],

  isAway() {
    return ActivityStore.away !== AwayEnum.OFF;
  },

  onClick: function (evt: React.SyntheticEvent<any>) {
    SystemActions.setAway(!this.isAway());
  },

  render() {
    const iconColor = this.isAway() ? 'yellow' : 'grey';
    return (
      <i 
        className={ iconColor + ' away-state link large wait icon' } 
        onClick={ this.onClick }
      />
    );
  },
});

export default AwayIcon;