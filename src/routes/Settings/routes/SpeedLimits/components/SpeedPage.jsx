import React from 'react';

import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const ConnectionSpeed = t.refinement(t.Str, n => {
	return n.match(/^\d+(\.)?(\d+)?$/) !== null;
});

ConnectionSpeed.getValidationErrorMessage = function (value, path, context) {
	return 'Please enter numeric speed';
};

const Entry = {
	download_speed: ConnectionSpeed,
	upload_speed: ConnectionSpeed,
};

const SpeedPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	render() {
		return (
			<div className="speed-settings">
				<div className="ui message">
					Please be as accurate as possible and set the ACTUAL speed of your connection. You may use an online tester, such as <a href="http://www.speedtest.net/">Speedtest.net</a>, to test your speed.
				</div>
				<SettingForm
					ref="form"
					formItems={Entry}
					//onFieldSetting={this.onFieldSetting}
				/>
			</div>
		);
	}
});

export default SpeedPage;