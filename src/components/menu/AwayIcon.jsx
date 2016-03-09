import React from 'react';
import Reflux from 'reflux';

import { AwayEnum } from 'constants/SystemConstants';
import SystemActions from 'actions/SystemActions';
import ActivityStore from 'stores/ActivityStore';


const AwayIcon = React.createClass({
	mixins: [ Reflux.connect(ActivityStore, 'activityState') ],

	isAway() {
		return ActivityStore.away !== AwayEnum.OFF;
	},

	onClick: function (evt) {
		SystemActions.setAway(!this.isAway());
	},

	render: function () {
		const iconColor = this.isAway() ? 'yellow' : 'grey';
		return <i className={ iconColor + ' away-state link large wait icon' } onClick={ this.onClick }></i>;
	}
});

export default AwayIcon;