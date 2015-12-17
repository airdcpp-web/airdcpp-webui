import React from 'react';
import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import { ConnectionModeEnum } from 'constants/SettingConstants';

const ProtocolPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	convertValue(key) {
		return key + '_' + this.props.protocol;
	},

	onFieldSetting(id, fieldOptions, formValue, settingInfo) {
		const protocolEnabled = formValue[this.convertValue('connection_mode')] !== ConnectionModeEnum.INCOMING_DISABLED;
		const autoDetect = formValue[this.convertValue('connection_auto')];

		if ((!protocolEnabled || autoDetect) && (
			id.indexOf('connection_ip') === 0 || id.indexOf('connection_bind') === 0 ||
			id.indexOf('connection_update_ip') === 0)) {
			
			fieldOptions['disabled'] = true;
		}

		if (autoDetect && id.indexOf('connection_mode') === 0 && protocolEnabled) {
			fieldOptions['disabled'] = true;
		}

		if (!protocolEnabled && id.indexOf('connection_auto') === 0) {
			fieldOptions['disabled'] = true;
		}
	},

	render() {
		return (
			<div className="detection-settings">
				<SettingForm
					ref="form"
					formItems={this.props.formItems}
					onFieldSetting={this.onFieldSetting}
				/>
			</div>
		);
	}
});

export default ProtocolPage;