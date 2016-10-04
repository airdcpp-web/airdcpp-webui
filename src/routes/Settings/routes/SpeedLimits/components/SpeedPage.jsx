import React from 'react';

import ExternalLink from 'components/ExternalLink';
import LinkConstants from 'constants/LinkConstants';

import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
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
			<div>
				<div className="ui message">
					Please be as accurate as possible and set the ACTUAL speed of your connection. You may use an online tester, 
					such as <ExternalLink url={ LinkConstants.SPEEDTEST_URL }>Speedtest.net</ExternalLink>, to test your speed.
				</div>
				<RemoteSettingForm
					ref="form"
					formItems={Entry}
					//onFieldSetting={this.onFieldSetting}
				/>
			</div>
		);
	}
});

export default SpeedPage;