import React from 'react';

import BrowserUtils from 'utils/BrowserUtils';
import LocalSettingStore from 'stores/LocalSettingStore';

const TouchIcon = React.createClass({
	onClick: function (evt) {
		LocalSettingStore.toggleTouchMode();
		this.forceUpdate();
	},

	render: function () {
		if (!BrowserUtils.hasTouchSupport()) {
			return null;
		}

		const touchIconColor = LocalSettingStore.touchModeEnabled ? 'blue' : 'grey';
		return <i className={ touchIconColor + ' link large pointing up icon' } onClick={ this.onClick }></i>;
	}
});

export default TouchIcon;